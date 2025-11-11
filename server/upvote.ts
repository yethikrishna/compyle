"use server";

import { db } from "@/db";
import { upvotes } from "@/db/schemas/upvote";
import { getUserFromAuth } from "@/server/user";
import { and, eq } from "drizzle-orm";

export async function toggleUpvote({
  appId,
}: {
  appId: string;
}): Promise<{ success: boolean; action: "removed" | "added" }> {
  try {
    if (!appId) {
      throw new Error("Invalid app ID");
    }

    const user = await getUserFromAuth();

    const existingUpvote = await db
      .select()
      .from(upvotes)
      .where(and(eq(upvotes.userId, user.id), eq(upvotes.appId, appId)));

    if (existingUpvote.length >= 1) {
      await db
        .delete(upvotes)
        .where(and(eq(upvotes.userId, user.id), eq(upvotes.appId, appId)));

      return { success: true, action: "removed" };
    } else {
      await db.insert(upvotes).values({ appId, userId: user.id });
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
  appId,
}: {
  appId: string;
}): Promise<{ hasUpvoted: boolean }> {
  try {
    if (!appId) {
      throw new Error("Invalid app ID");
    }

    const user = await getUserFromAuth();

    const existingUpvote = await db
      .select()
      .from(upvotes)
      .where(and(eq(upvotes.userId, user.id), eq(upvotes.appId, appId)));

    if (existingUpvote.length >= 1) {
      return { hasUpvoted: true };
    } else {
      return { hasUpvoted: false };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch upvote status");
  }
}
