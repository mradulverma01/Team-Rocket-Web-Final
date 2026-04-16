import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

export const createComplaint = mutationGeneric({
  args: {
    submittedBy: v.string(),
    category: v.union(
      v.literal("maintenance"),
      v.literal("food"),
      v.literal("safety"),
      v.literal("other"),
    ),
    description: v.string(),
    hostelBlock: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const referenceId = `CMP-${now.toString().slice(-8)}`;
    const id = await ctx.db.insert("complaints", {
      ...args,
      referenceId,
      status: "open",
      createdAt: now,
      updatedAt: now,
    });

    return { referenceId, id };
  },
});

export const listBySubmitter = queryGeneric({
  args: {
    submittedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const complaints = await ctx.db.query("complaints").order("desc").take(25);

    if (!args.submittedBy) {
      return complaints;
    }

    return complaints.filter((complaint) => complaint.submittedBy === args.submittedBy);
  },
});
