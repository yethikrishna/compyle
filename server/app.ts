"use server";

import { db } from "@/lib/db";
import { createAppSchema } from "@/schema/app.schema";
import { z, ZodError } from "zod";
import { getUserFromAuth } from "./user";

export async function createApp(
  values: z.infer<typeof createAppSchema>,
): Promise<boolean> {
  try {
    const data = createAppSchema.parse(values);
    const user = await getUserFromAuth();

    await db.app.create({ data: { ...data, userId: user.id } });
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
