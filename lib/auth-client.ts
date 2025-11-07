import { createAuthClient } from "better-auth/react";

export const { signUp, signIn, useSession, sendVerificationEmail } =
  createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL!,
  });
