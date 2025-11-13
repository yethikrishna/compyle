import { apps } from "@/db/schemas/app";
import { comments } from "@/db/schemas/comment";
import { userRoleEnum } from "@/db/schemas/enums";
import { timestamps } from "@/db/schemas/timestamps";
import { upvotes } from "@/db/schemas/upvote";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
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
  username: text("username").notNull(),
  displayUsername: text("displayUsername").notNull(),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  apps: many(apps),
  upvotes: many(upvotes),
  comments: many(comments),
}));
