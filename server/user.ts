"use server";

import { auth } from "@/lib/auth";
import { User } from "better-auth";
import { headers } from "next/headers";

export async function getUserFromAuth(): Promise<User> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new Error("Unauthorized");
    }

    return session.user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unauthorized");
  }
}
