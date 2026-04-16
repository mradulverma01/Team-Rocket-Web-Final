import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  /**
   * Extended user profile — role determines portal access.
   * The `users` table from authTables is extended with custom fields.
   */
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    /** Portal role: patient, student, doctor, admin */
    role: v.optional(
      v.union(
        v.literal("patient"),
        v.literal("student"),
        v.literal("doctor"),
        v.literal("admin"),
      ),
    ),
    /** Google OAuth specific fields */
    googleId: v.optional(v.string()),
    givenName: v.optional(v.string()),
    familyName: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("googleId", ["googleId"]),

  appointments: defineTable({
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.string(),
    department: v.string(),
    doctorId: v.string(),
    date: v.string(),
    timeSlot: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    appointmentId: v.string(),
    notes: v.optional(v.string()),
    amountPaise: v.number(),
    paymentStatus: v.union(
      v.literal("not_required"),
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded"),
    ),
    paymentOrderId: v.optional(v.string()),
    paymentId: v.optional(v.string()),
    source: v.union(v.literal("web"), v.literal("android"), v.literal("ios")),
    createdAt: v.number(),
    userId: v.optional(v.id("users")),
    notificationStatus: v.optional(
      v.union(
        v.literal("idle"),
        v.literal("pending"),
        v.literal("sent"),
        v.literal("skipped"),
        v.literal("failed"),
      ),
    ),
    confirmationSentAt: v.optional(v.number()),
    notificationError: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_date", ["date"])
    .index("by_patient_email", ["patientEmail"])
    .index("by_appointment_id", ["appointmentId"])
    .index("by_user_id", ["userId"]),

  complaints: defineTable({
    submittedBy: v.string(),
    category: v.union(
      v.literal("maintenance"),
      v.literal("food"),
      v.literal("safety"),
      v.literal("other"),
    ),
    description: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
    ),
    referenceId: v.string(),
    hostelBlock: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_submitted_by", ["submittedBy"]),

  schedules: defineTable({
    department: v.string(),
    dayOfWeek: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    subject: v.string(),
    facultyName: v.string(),
    room: v.string(),
    year: v.number(),
  })
    .index("by_department_and_dayOfWeek", ["department", "dayOfWeek"])
    .index("by_department_and_year", ["department", "year"]),

  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    targetAudience: v.union(
      v.literal("patients"),
      v.literal("students"),
      v.literal("all"),
    ),
    publishedBy: v.string(),
    isActive: v.boolean(),
    publishedAt: v.number(),
  })
    .index("by_isActive", ["isActive"])
    .index("by_targetAudience", ["targetAudience"]),

  reports: defineTable({
    patientId: v.id("users"),
    reportType: v.union(
      v.literal("lab"),
      v.literal("radiology"),
      v.literal("pathology"),
      v.literal("prescription"),
      v.literal("other"),
    ),
    appointmentId: v.optional(v.id("appointments")),
    externalFileKey: v.optional(v.string()),
    externalFileUrl: v.optional(v.string()),
    deliveryStatus: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed"),
    ),
    uploadedAt: v.number(),
    expiryTime: v.number(),
    archivedAt: v.optional(v.number()),
  })
    .index("by_patient_id", ["patientId"])
    .index("by_appointment_id", ["appointmentId"])
    .index("by_expiry_time", ["expiryTime"]),
});
