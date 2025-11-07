"use server";

import { db } from "@/db";
import { apps } from "@/db/schemas/app";
import { createAppSchema } from "@/schema/app.schema";
import { getUserFromAuth } from "@/server/user";
import { and, eq } from "drizzle-orm";
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

export async function getDashboardApps(): Promise<
  Array<typeof apps.$inferSelect>
> {
  try {
    const user = await getUserFromAuth();
    const res = await db.select().from(apps).where(eq(apps.userId, user.id));

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
  Array<typeof apps.$inferSelect>
> {
  try {
    const res = await db
      .select()
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

export async function getPublicAppDetails({
  id,
}: {
  id: string;
}): Promise<typeof apps.$inferSelect> {
  try {
    if (!id) {
      throw new Error("Invalid app ID");
    }

    const res = await db
      .select()
      .from(apps)
      .where(and(eq(apps.id, id), eq(apps.status, "published")));

    if (res.length < 1) {
      throw new Error("No app found with the provided ID");
    }

    return res[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch app");
  }
}
