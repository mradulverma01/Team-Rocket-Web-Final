import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation, query } from "./_generated/server";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

export const viewerProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

export const upsertViewerProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.optional(
      v.union(
        v.literal("patient"),
        v.literal("student"),
        v.literal("doctor"),
        v.literal("admin"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in to update your profile.");
    }

    const normalizedEmail = normalizeEmail(args.email);
    const normalizedPhone = normalizePhone(args.phone);

    await ctx.db.patch(userId, {
      name: args.name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      role: args.role ?? "patient",
    });

    return await ctx.db.get(userId);
  },
});
