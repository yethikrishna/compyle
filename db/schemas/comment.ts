import { apps } from "@/db/schemas/app";
import { timestamps } from "@/db/schemas/timestamps";
import { users } from "@/db/schemas/user";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const comments = pgTable("comment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  content: text("content").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  appId: text("appId")
    .notNull()
    .references(() => apps.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  app: one(apps, {
    fields: [comments.appId],
    references: [apps.id],
  }),
}));
