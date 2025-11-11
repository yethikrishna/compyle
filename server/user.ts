"use server";

import { db } from "@/db";
import { users } from "@/db/schemas/user";
import { auth } from "@/lib/auth";
import { ActualUser } from "@/types/user";
import { User } from "better-auth";
import { eq } from "drizzle-orm";
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

export async function getPublicUserProfile({
  username,
}: {
  username: string;
}): Promise<ActualUser> {
  try {
    if (!username) {
      throw new Error("Invalid username");
    }

    // Filter out user data dont return sensitive info
    const res = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (res.length < 1) {
      throw new Error("No user found with the provided username");
    }

    return res[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch user profile");
  }
}
