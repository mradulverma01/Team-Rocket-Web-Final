import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("patient"),
      v.literal("student"),
      v.literal("admin"),
      v.literal("doctor")
    ),
    workosId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  doctors: defineTable({
    name: v.string(),
    department: v.string(),
    specialization: v.string(),
    availability: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_department", ["department"]),

  departments: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  appointments: defineTable({
    patientId: v.id("users"),
    doctorId: v.id("doctors"),
    date: v.number(),
    timeSlot: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    appointmentId: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_date", ["date"])
    .index("by_patient", ["patientId"]),

  complaints: defineTable({
    submittedBy: v.id("users"),
    category: v.union(
      v.literal("maintenance"),
      v.literal("food"),
      v.literal("safety"),
      v.literal("other")
    ),
    description: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved")
    ),
    hostelBlock: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_user", ["submittedBy"]),

  schedules: defineTable({
    department: v.string(),
    dayOfWeek: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    subject: v.string(),
    facultyName: v.string(),
    room: v.string(),
    year: v.number(),
    createdAt: v.number(),
  }).index("by_department_day", ["department", "dayOfWeek"]),

  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    targetAudience: v.union(
      v.literal("patients"),
      v.literal("students"),
      v.literal("all")
    ),
    publishedBy: v.id("users"),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_active", ["isActive"]),

  reports: defineTable({
    patientId: v.id("users"),
    fileUrl: v.string(),
    description: v.string(),
    createdAt: v.number(),
  }).index("by_patient", ["patientId"]),
});