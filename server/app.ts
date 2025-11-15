"use server";

import { db } from "@/db";
import { apps } from "@/db/schemas/app";
import { comments } from "@/db/schemas/comment";
import { upvotes } from "@/db/schemas/upvote";
import { users } from "@/db/schemas/user";
import { createAppSchema } from "@/schema/app.schema";
import { getUserFromAuth } from "@/server/user";
import { AppPublishStatus } from "@/types/app";
import { and, countDistinct, eq, sql } from "drizzle-orm";
import { z, ZodError } from "zod";

export async function createApp(
  values: z.infer<typeof createAppSchema>,
): Promise<boolean> {
  try {
    const data = createAppSchema.parse(values);
    const user = await getUserFromAuth();

    await db.insert(apps).values({
      ...data,
      userId: user.id,
    });

    return true;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("Invalid input data");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to submit app");
  }
}

export async function updateAppPublishStatus({
  appId,
  newStatus,
}: {
  appId: string;
  newStatus: AppPublishStatus;
}): Promise<boolean> {
  try {
    if (!appId || !newStatus) {
      throw new Error("Invalid app ID or app status");
    }

    const user = await getUserFromAuth();

    await db
      .update(apps)
      .set({ status: newStatus })
      .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to update app status");
  }
}

export async function deleteApp({
  appId,
}: {
  appId: string;
}): Promise<boolean> {
  try {
    if (!appId) {
      throw new Error("Invalid app ID");
    }

    const user = await getUserFromAuth();

    await db
      .delete(apps)
      .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to delete app");
  }
}

export async function getDashboardApps(): Promise<
  Array<{
    app: typeof apps.$inferSelect;
    upvoteCount: number;
    commentCount: number;
  }>
> {
  try {
    const user = await getUserFromAuth();

    const res = await db
      .select({
        app: apps,
        upvoteCount: countDistinct(upvotes.userId),
        commentCount: countDistinct(comments.id),
      })
      .from(apps)
      .leftJoin(upvotes, eq(apps.id, upvotes.appId))
      .leftJoin(comments, eq(apps.id, comments.appId))
      .where(eq(apps.userId, user.id))
      .groupBy(apps.id);

    if (!res) {
      throw new Error("No submitted apps found");
    }

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch apps");
  }
}

export async function getPublicApps(): Promise<
  Array<{
    app: typeof apps.$inferSelect;
    upvoteCount: number;
  }>
> {
  try {
    const res = await db
      .select({
        app: apps,
        upvoteCount: sql<number>`
          (
            SELECT count(*)
            FROM ${upvotes}
            WHERE ${upvotes.appId} = ${apps.id}
          )
        `,
      })
      .from(apps)
      .where(eq(apps.status, "published"));

    if (!res) {
      throw new Error("No apps found");
    }

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch apps");
  }
}

export async function getPublicAppDetails({ id }: { id: string }): Promise<{
  appDetails: typeof apps.$inferSelect;
  userDetails: {
    id: string;
    name: string;
    image: string | null;
    username: string;
  };
  upvoteCount: number;
}> {
  try {
    if (!id) {
      throw new Error("Invalid app ID");
    }

    const res = await db
      .select({
        app: apps,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
          username: users.username,
        },
        upvoteCount: sql<number>`
          (
            SELECT count(*)
            FROM ${upvotes}
            WHERE ${upvotes.appId} = ${apps.id}
          )
        `,
      })
      .from(apps)
      .where(and(eq(apps.id, id), eq(apps.status, "published")))
      .innerJoin(users, eq(users.id, apps.userId));

    if (res.length < 1) {
      throw new Error("No app found with the provided ID");
    }

    return {
      appDetails: res[0].app,
      userDetails: res[0].user,
      upvoteCount: res[0].upvoteCount,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch app");
  }
}
