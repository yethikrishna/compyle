import { appStatusEnum } from "@/db/schemas/enums";
import { timestamps } from "@/db/schemas/timestamps";
import { users } from "@/db/schemas/user";
import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

export const apps = pgTable("app", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  coverImage: text("coverImage"),
  websiteUrl: text("websiteUrl"),
  repoUrl: text("repoUrl"),
  demoUrl: text("demoUrl"),
  tags: text("tags").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  verified: boolean("verified").notNull().default(false),
  likes: integer("likes").notNull().default(0),
  status: appStatusEnum("status").notNull().default("published"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const appsRelations = relations(apps, ({ one }) => ({
  user: one(users, {
    fields: [apps.userId],
    references: [users.id],
  }),
}));
