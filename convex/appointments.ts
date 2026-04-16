import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

const paymentStatus = v.union(
  v.literal("not_required"),
  v.literal("pending"),
  v.literal("paid"),
  v.literal("failed"),
  v.literal("refunded"),
);

const source = v.union(v.literal("web"), v.literal("android"), v.literal("ios"));

export const createBooking = mutationGeneric({
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
    paymentStatus,
    source,
  },
  handler: async (ctx, args) => {
    const appointmentId = `RRD-${Date.now().toString().slice(-8)}`;
    const createdAt = Date.now();
    const id = await ctx.db.insert("appointments", {
      ...args,
      appointmentId,
      status: "pending",
      createdAt,
    });

    return { appointmentId, id };
  },
});

export const listByPatientEmail = queryGeneric({
  args: {
    patientEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.patientEmail) {
      return await ctx.db
        .query("appointments")
        .withIndex("by_patient_email", (query) =>
          query.eq("patientEmail", args.patientEmail!),
        )
        .order("desc")
        .collect();
    }

    return await ctx.db.query("appointments").order("desc").take(20);
  },
});

export const listQueueByDate = queryGeneric({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_date", (query) => query.eq("date", args.date))
      .order("asc")
      .collect();
  },
});

export const markPaymentInitiated = mutationGeneric({
  args: {
    appointmentId: v.string(),
    paymentOrderId: v.string(),
  },
  handler: async (ctx, args) => {
    const appointment = await ctx.db
      .query("appointments")
      .filter((query) => query.eq(query.field("appointmentId"), args.appointmentId))
      .first();

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
