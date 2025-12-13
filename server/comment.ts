"use server";

import { db } from "@/db";
import { apps } from "@/db/schemas/app";
import { comments } from "@/db/schemas/comment";
import { users } from "@/db/schemas/user";
import { createCommentSchema } from "@/schema/comment.schema";
import { getUserFromAuth } from "@/server/user";
import { and, desc, eq, lt } from "drizzle-orm";
import z, { ZodError } from "zod";

export async function addComment(
  appId: string,
  values: z.infer<typeof createCommentSchema>,
): Promise<boolean> {
  try {
    if (!appId) {
      throw new Error("Invalid app ID");
    }

    const data = createCommentSchema.parse(values);
    const user = await getUserFromAuth();

    await db.insert(comments).values({
      appId,
      userId: user.id,
      content: data.comment,
    });

    return true;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("Invalid input data");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to add comment");
  }
}

export async function getAppComments({
  appSlug,
  limit = 15,
  cursor,
}: {
  appSlug: string;
  limit?: number;
  cursor?: string; // The createdAt timestamp of the last comment
}): Promise<{
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
      username: string;
    };
  }>;
  nextCursor: string | null;
}> {
  try {
    if (!appSlug) {
      throw new Error("Invalid app slug");
    }

    // Build where conditions using join with apps table
    const whereConditions = cursor
      ? and(eq(apps.slug, appSlug), lt(comments.createdAt, new Date(cursor)))
      : eq(apps.slug, appSlug);

    const appComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
          username: users.username,
        },
      })
      .from(comments)
      .innerJoin(apps, eq(comments.appId, apps.id))
      .innerJoin(users, eq(comments.userId, users.id))
      .where(whereConditions)
      .orderBy(desc(comments.createdAt))
      .limit(limit + 1); // Fetch one extra to determine if there are more

    // Check if there are more comments
    const hasMore = appComments.length > limit;
    const commentsToReturn = hasMore
      ? appComments.slice(0, limit)
      : appComments;

    // Use the last comment's createdAt as the next cursor
    const nextCursor = hasMore
      ? commentsToReturn[commentsToReturn.length - 1].createdAt.toISOString()
      : null;

    return {
      comments: commentsToReturn,
      nextCursor,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch comments");
  }
}
