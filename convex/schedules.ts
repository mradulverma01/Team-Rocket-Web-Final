import { queryGeneric } from "convex/server";
import { v } from "convex/values";

export const listByDepartment = queryGeneric({
  args: {
    department: v.optional(v.string()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const schedules = await ctx.db.query("schedules").order("asc").collect();

    return schedules.filter((schedule) => {
      const departmentMatches = args.department
        ? schedule.department === args.department
        : true;
      const yearMatches = args.year ? schedule.year === args.year : true;
      return departmentMatches && yearMatches;
    });
  },
});
