import { createAuthClient } from "better-auth/react";

export const { signUp, signIn } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
});
