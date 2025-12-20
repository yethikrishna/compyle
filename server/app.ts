"use server";

import { db } from "@/db";
import { apps } from "@/db/schemas/app";
import { comments } from "@/db/schemas/comment";
import { images } from "@/db/schemas/image";
import { upvotes } from "@/db/schemas/upvote";
import { users } from "@/db/schemas/user";
import { createAppSchema } from "@/schema/app.schema";
import { getUserFromAuth } from "@/server/user";
import { AppPublishStatus } from "@/types/app";
import { ImageData } from "@/types/image";
import { and, countDistinct, desc, eq, lt, sql } from "drizzle-orm";
import { z, ZodError } from "zod";
import NodeImageKit from "@imagekit/nodejs";
import { env } from "@/env/server";

const imagekitClient = new NodeImageKit({
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
});

export async function createApp(params: {
  values: z.infer<typeof createAppSchema>;
  imageData: ImageData | null;
}): Promise<boolean> {
  try {
    const { values, imageData } = params;
    const data = createAppSchema.parse(values);
    const user = await getUserFromAuth();

    // Validate image data
    if (!imageData) {
      throw new Error("Image data is required");
    }

    await db.transaction(async (tx) => {
      const [insertedImage] = await tx
        .insert(images)
        .values({
          url: imageData.url,
          providerFileId: imageData.fileId,
          thumbnailUrl: imageData.thumbnailUrl,
        })
        .returning({ id: images.id });

      if (!insertedImage?.id) {
        tx.rollback();
        throw new Error("Failed to save image data");
      }

      const imageId = insertedImage.id;

      await tx.insert(apps).values({
        ...data,
        userId: user.id,
        coverImage: imageData.url,
        coverImageId: imageId,
      });
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

export async function updateAppDetails(
  values: z.infer<typeof createAppSchema>,
  appId: string,
  imageData?: ImageData | null,
): Promise<boolean> {
  try {
    const data = createAppSchema.parse(values);
    const user = await getUserFromAuth();

    // Get the current app details to check for existing image
    const [currentApp] = await db
      .select({
        coverImageId: apps.coverImageId,
        coverImage: apps.coverImage,
      })
      .from(apps)
      .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));

    if (!currentApp) {
      throw new Error(
        "App not found or you don't have permission to update it",
      );
    }

    await db.transaction(async (tx) => {
      let newImageId = currentApp.coverImageId;
      let newCoverImage = currentApp.coverImage;

      // If new image data is provided
      if (imageData) {
        // Delete old image from ImageKit if it exists
        if (currentApp.coverImageId) {
          const [oldImage] = await tx
            .select({
              providerFileId: images.providerFileId,
            })
            .from(images)
            .where(eq(images.id, currentApp.coverImageId!));

          if (oldImage?.providerFileId) {
            try {
              await imagekitClient.files.delete(oldImage.providerFileId);
            } catch (error) {
              console.error("Failed to delete old image from ImageKit:", error);
              // Continue with the transaction even if ImageKit deletion fails
            }
          }

          // Delete old image record from database
          await tx
            .delete(images)
            .where(eq(images.id, currentApp.coverImageId!));
        }

        // Insert new image record
        const [insertedImage] = await tx
          .insert(images)
          .values({
            url: imageData.url,
            providerFileId: imageData.fileId,
            thumbnailUrl: imageData.thumbnailUrl,
          })
          .returning({ id: images.id });

        if (!insertedImage?.id) {
          tx.rollback();
          throw new Error("Failed to save new image data");
        }

        newImageId = insertedImage.id;
        newCoverImage = imageData.url;
      }

      // Update app details
      await tx
        .update(apps)
        .set({
          name: data.name,
          slug: data.slug,
          description: data.description,
          category: data.category,
          builtWith: data.builtWith,
          websiteUrl: data.websiteUrl,
          repoUrl: data.repoUrl,
          demoUrl: data.demoUrl,
          status: data.status,
          coverImage: newCoverImage,
          coverImageId: newImageId,
        })
        .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));
    });

    return true;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("Invalid input data");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to update app details");
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

    // Get app details before deletion to delete associated image
    const [appToDelete] = await db
      .select({
        coverImageId: apps.coverImageId,
      })
      .from(apps)
      .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));

    await db.transaction(async (tx) => {
      // Delete the app
      await tx
        .delete(apps)
        .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));

      // Delete associated image if it exists
      if (appToDelete?.coverImageId) {
        const [imageToDelete] = await tx
          .select({
            providerFileId: images.providerFileId,
          })
          .from(images)
          .where(eq(images.id, appToDelete.coverImageId!));

        if (imageToDelete?.providerFileId) {
          try {
            await imagekitClient.files.delete(imageToDelete.providerFileId);
          } catch (error) {
            console.error("Failed to delete image from ImageKit:", error);
            // Continue with the transaction even if ImageKit deletion fails
          }
        }

        // Delete image record from database
        await tx.delete(images).where(eq(images.id, appToDelete.coverImageId!));
      }
    });

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

export async function getPublicApps({
  limit = 15,
  cursor,
}: {
  limit?: number;
  cursor?: string; // The createdAt timestamp of the last app
} = {}): Promise<{
  apps: Array<{
    app: typeof apps.$inferSelect;
    upvoteCount: number;
  }>;
  nextCursor: string | null;
}> {
  try {
    const whereConditions = cursor
      ? and(eq(apps.status, "published"), lt(apps.createdAt, new Date(cursor)))
      : eq(apps.status, "published");

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
      .where(whereConditions)
      .orderBy(desc(apps.createdAt))
      .limit(limit + 1); // Fetch one extra to determine if there are more

    if (!res) {
      throw new Error("No apps found");
    }

    // Check if there are more apps
    const hasMore = res.length > limit;
    const appsToReturn = hasMore ? res.slice(0, limit) : res;

    // Use the last app's createdAt as the next cursor
    const nextCursor = hasMore
      ? appsToReturn[appsToReturn.length - 1].app.createdAt.toISOString()
      : null;

    return {
      apps: appsToReturn,
      nextCursor,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch apps");
  }
}

export async function getPublicFeaturedApps(): Promise<
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
      .where(and(eq(apps.status, "published"), eq(apps.featured, true)))
      .limit(3);

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

export async function getPublicAppDetails({ slug }: { slug: string }): Promise<{
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
    if (!slug) {
      throw new Error("Invalid app slug");
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
      .where(and(eq(apps.slug, slug), eq(apps.status, "published")))
      .innerJoin(users, eq(users.id, apps.userId));

    if (res.length < 1) {
      throw new Error("No app found with the provided slug");
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

export async function getPublicAppSEODetails({
  slug,
}: {
  slug: string;
}): Promise<{
  name: string;
  description: string;
  image: string | null;
}> {
  try {
    if (!slug) {
      throw new Error("Invalid app slug");
    }

    const res = await db
      .select({
        name: apps.name,
        description: apps.description,
        image: apps.coverImage,
      })
      .from(apps)
      .where(and(eq(apps.slug, slug), eq(apps.status, "published")));

    if (res.length < 1) {
      throw new Error("No app found with the provided slug");
    }

    return res[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch app");
  }
}

export async function getDashboardAppDetails({ id }: { id: string }): Promise<{
  appDetails: typeof apps.$inferSelect;
  upvoteCount: number;
  imageDetails?: {
    url: string;
    fileId: string;
    thumbnailUrl: string;
  } | null;
}> {
  try {
    if (!id) {
      throw new Error("Invalid app ID");
    }

    const user = await getUserFromAuth();

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
        image: {
          url: images.url,
          providerFileId: images.providerFileId,
          thumbnailUrl: images.thumbnailUrl,
        },
      })
      .from(apps)
      .where(and(eq(apps.id, id), eq(apps.userId, user.id)))
      .leftJoin(images, eq(images.id, apps.coverImageId))
      .innerJoin(users, eq(users.id, apps.userId));

    if (res.length < 1) {
      throw new Error("No app found with the provided ID");
    }

    const imageDetails =
      res[0].image && res[0].image.url
        ? {
            url: res[0].image.url,
            fileId: res[0].image.providerFileId || "",
            thumbnailUrl: res[0].image.thumbnailUrl || res[0].image.url,
          }
        : null;

    return {
      appDetails: res[0].app,
      upvoteCount: res[0].upvoteCount,
      imageDetails,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch app");
  }
}
