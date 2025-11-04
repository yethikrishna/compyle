import { userRoleEnum } from "@/db/schemas/enums";
import { timestamps } from "@/db/schemas/timestamps";
import { createId } from "@paralleldrive/cuid2";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("user"),
  ...timestamps,
});
