"use server";
import { db } from "@/db";
import { apps } from "@/db/schemas/app";
import { upvotes } from "@/db/schemas/upvote";
import { getUserFromAuth } from "@/server/user";
import { and, eq } from "drizzle-orm";

export async function toggleUpvote({
  appSlug,
}: {
  appSlug: string;
}): Promise<{ success: boolean; action: "removed" | "added" }> {
  try {
    if (!appSlug) {
      throw new Error("Invalid app slug");
    }

    const user = await getUserFromAuth();

    const existingUpvote = await db
      .select({ appId: apps.id })
      .from(upvotes)
      .innerJoin(apps, eq(upvotes.appId, apps.id))
      .where(and(eq(upvotes.userId, user.id), eq(apps.slug, appSlug)))
      .limit(1);

    if (existingUpvote.length >= 1) {
      const appId = existingUpvote[0].appId;
      await db
        .delete(upvotes)
        .where(and(eq(upvotes.userId, user.id), eq(upvotes.appId, appId)));
      return { success: true, action: "removed" };
    } else {
      const app = await db
        .select({ id: apps.id })
        .from(apps)
        .where(eq(apps.slug, appSlug))
        .limit(1);

      if (!app || app.length === 0) {
        throw new Error("App not found");
      }

      await db.insert(upvotes).values({ appId: app[0].id, userId: user.id });
      return { success: true, action: "added" };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to change upvote status");
  }
}

export async function checkUserUpvote({
  appSlug,
}: {
  appSlug: string;
}): Promise<{ hasUpvoted: boolean }> {
  try {
    if (!appSlug) {
      throw new Error("Invalid app slug");
    }

    const user = await getUserFromAuth();

    const existingUpvote = await db
      .select()
      .from(upvotes)
      .innerJoin(apps, eq(upvotes.appId, apps.id))
      .where(and(eq(upvotes.userId, user.id), eq(apps.slug, appSlug)))
      .limit(1);

    return { hasUpvoted: existingUpvote.length >= 1 };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch upvote status");
  }
}
