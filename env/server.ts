import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url().startsWith("postgresql://"),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    RESEND_API_KEY: z.string().startsWith("re_"),
    IMAGEKIT_PRIVATE_KEY: z.string().startsWith("private_"),
    IMAGEKIT_PUBLIC_KEY: z.string().startsWith("public_"),
    IMAGEKIT_URL_ENDPOINT: z.url(),
  },
  experimental__runtimeEnv: process.env,
});
