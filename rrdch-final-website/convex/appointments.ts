import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const source = v.union(
  v.literal("web"),
  v.literal("android"),
  v.literal("ios"),
);

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

async function getAppointmentById(ctx: any, appointmentId: string) {
  return await ctx.db
    .query("appointments")
    .withIndex("by_appointment_id", (query: any) =>
      query.eq("appointmentId", appointmentId),
    )
    .unique();
}

export const createBooking = mutation({
  args: {
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.string(),
    department: v.string(),
    doctorId: v.string(),
    date: v.string(),
    timeSlot: v.string(),
    notes: v.optional(v.string()),
    amountPaise: v.number(),
    source,
  },
  handler: async (ctx, args) => {
    const appointmentId = `RRD-${Date.now().toString().slice(-8)}`;
    const createdAt = Date.now();
    const userId = await getAuthUserId(ctx);
    const patientEmail = normalizeEmail(args.patientEmail);
    const patientPhone = normalizePhone(args.patientPhone);
    const requiresPayment = args.amountPaise > 0;

    if (userId) {
      const currentUser = await ctx.db.get(userId);
      await ctx.db.patch(userId, {
        name: args.patientName.trim(),
        email: patientEmail,
        phone: patientPhone,
        role: currentUser?.role ?? "patient",
      });
    }

    const id = await ctx.db.insert("appointments", {
      ...args,
      patientName: args.patientName.trim(),
      patientEmail,
      patientPhone,
      appointmentId,
      status: requiresPayment ? "pending" : "confirmed",
      createdAt,
      paymentStatus: requiresPayment ? "pending" : "not_required",
      notificationStatus: "idle",
      userId: userId ?? undefined,
    });

    return {
      appointmentId,
      id,
      confirmedImmediately: !requiresPayment,
      requiresPayment,
    };
  },
});

export const listByPatientEmail = query({
  args: {
    patientEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patientEmail = args.patientEmail ? normalizeEmail(args.patientEmail) : undefined;
    if (patientEmail !== undefined) {
      return await ctx.db
        .query("appointments")
        .withIndex("by_patient_email", (query) =>
          query.eq("patientEmail", patientEmail),
        )
        .order("desc")
        .take(25);
    }

    return await ctx.db.query("appointments").order("desc").take(20);
  },
});

export const listForViewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId) {
      const appointments = await ctx.db
        .query("appointments")
        .withIndex("by_user_id", (query) => query.eq("userId", userId))
        .order("desc")
        .take(50);

      if (appointments.length > 0) {
        return appointments;
      }

      const user = await ctx.db.get(userId);
      if (user?.email) {
        return await ctx.db
          .query("appointments")
          .withIndex("by_patient_email", (query) =>
            query.eq("patientEmail", normalizeEmail(user.email!)),
          )
          .order("desc")
          .take(25);
      }
    }

    return [];
  },
});

export const listQueueByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_date", (query) => query.eq("date", args.date))
      .order("asc")
      .take(50);
  },
});

export const markPaymentInitiated = mutation({
  args: {
    appointmentId: v.string(),
    paymentOrderId: v.string(),
  },
  handler: async (ctx, args) => {
    const appointment = await getAppointmentById(ctx, args.appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    await ctx.db.patch(appointment._id, {
      paymentOrderId: args.paymentOrderId,
      paymentStatus: "pending",
    });

    return { ok: true as const };
  },
});

export const finalizeBookingConfirmation = mutation({
  args: {
    appointmentId: v.string(),
    paymentOrderId: v.optional(v.string()),
    paymentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await getAppointmentById(ctx, args.appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const needsPayment = appointment.amountPaise > 0;
    const notificationStatus = appointment.notificationStatus ?? "idle";
    const nextNotificationStatus =
      notificationStatus === "idle"
        ? "pending"
        : notificationStatus;

    await ctx.db.patch(appointment._id, {
      status: "confirmed",
      paymentStatus: needsPayment ? "paid" : "not_required",
      paymentOrderId: args.paymentOrderId ?? appointment.paymentOrderId,
      paymentId: args.paymentId ?? appointment.paymentId,
      notificationStatus: nextNotificationStatus,
      notificationError: undefined,
    });

    const updated = await ctx.db.get(appointment._id);
    if (!updated) {
      throw new Error("Updated appointment not found");
    }

    return {
      appointment: updated,
      shouldNotify: notificationStatus === "idle",
    };
  },
});

export const markPaymentFailed = mutation({
  args: {
    appointmentId: v.string(),
    paymentOrderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await getAppointmentById(ctx, args.appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    await ctx.db.patch(appointment._id, {
      paymentOrderId: args.paymentOrderId ?? appointment.paymentOrderId,
      paymentStatus: "failed",
    });

    return { ok: true as const };
  },
});

export const markConfirmationNotification = mutation({
  args: {
    appointmentId: v.string(),
    status: v.union(v.literal("sent"), v.literal("skipped"), v.literal("failed")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await getAppointmentById(ctx, args.appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    await ctx.db.patch(appointment._id, {
      notificationStatus: args.status,
      confirmationSentAt:
        args.status === "sent" || args.status === "skipped"
          ? Date.now()
          : appointment.confirmationSentAt,
      notificationError: args.error,
    });

    return { ok: true as const };
  },
});
