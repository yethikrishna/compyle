import { db } from "@/db";
import { accounts, sessions, verifications } from "@/db/schemas/auth";
import { users } from "@/db/schemas/user";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const drizzleSchemas = {
  user: users,
  account: accounts,
  session: sessions,
  verification: verifications,
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: drizzleSchemas,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});
