"use server";

import { db } from "@/db";
import { apps } from "@/db/schemas/app";
import { upvotes } from "@/db/schemas/upvote";
import { getUserFromAuth } from "@/server/user";
import { and, eq, sql } from "drizzle-orm";

export async function getDashboardStats(): Promise<{
  totalApps: number;
  appsGrowth: number;
  totalUpvotes: number;
  upvotesGrowth: number;
  totalViews: number;
  viewsGrowth: number;
  totalFollowers: number;
  followersGrowth: number;
  upvotesOverTime: Array<{ month: string; upvotes: number }>;
}> {
  try {
    const user = await getUserFromAuth();

    const [appsResult, upvotesResult, upvotesOverTimeResult] =
      await Promise.all([
        db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(apps)
          .where(eq(apps.userId, user.id)),

        // Get total upvotes across all user's apps
        db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(upvotes)
          .innerJoin(apps, eq(apps.id, upvotes.appId))
          .where(eq(apps.userId, user.id)),

        // Get upvotes over time (last 6 months)
        db
          .select({
            year: sql<number>`EXTRACT(YEAR FROM ${upvotes.createdAt})::int`,
            month: sql<number>`EXTRACT(MONTH FROM ${upvotes.createdAt})::int`,
            upvotes: sql<number>`count(*)::int`,
          })
          .from(upvotes)
          .innerJoin(apps, eq(apps.id, upvotes.appId))
          .where(
            and(
              eq(apps.userId, user.id),
              sql`${upvotes.createdAt} >= NOW() - INTERVAL '6 months'`,
            ),
          )
          .groupBy(
            sql`EXTRACT(YEAR FROM ${upvotes.createdAt})`,
            sql`EXTRACT(MONTH FROM ${upvotes.createdAt})`,
          ),
      ]);

    const totalApps = appsResult[0]?.count || 0;
    const totalUpvotes = upvotesResult[0]?.count || 0;

    // Create a map of year-month to upvotes
    const upvotesMap = new Map(
      upvotesOverTimeResult.map((item) => [
        `${item.year}-${item.month}`,
        item.upvotes,
      ]),
    );

    // Generate last 6 months
    const now = new Date();
    const upvotesOverTime = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthName = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;

      return {
        month: monthName,
        upvotes: upvotesMap.get(key) || 0,
      };
    });

    // TODO: Implement views tracking
    const totalViews = 0;

    // TODO: Implement followers functionality
    // This would require a followers/follows table
    const totalFollowers = 0;

    // TODO: Calculate actual growth percentages
    // This would require storing historical data or timestamps
    // For now, returning 0 as placeholders
    const appsGrowth = 0;
    const upvotesGrowth = 0;
    const viewsGrowth = 0;
    const followersGrowth = 0;

    return {
      totalApps,
      appsGrowth,
      totalUpvotes,
      upvotesGrowth,
      totalViews,
      viewsGrowth,
      totalFollowers,
      followersGrowth,
      upvotesOverTime,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch dashboard stats");
  }
}
