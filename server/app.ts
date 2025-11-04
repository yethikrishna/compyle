"use server";

import { db } from "@/db";
import { apps } from "@/db/schemas/app";
import { createAppSchema } from "@/schema/app.schema";
import { getUserFromAuth } from "@/server/user";
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
