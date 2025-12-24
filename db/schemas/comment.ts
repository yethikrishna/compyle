import { apps } from "@/db/schemas/app";
import { timestamps } from "@/db/schemas/timestamps";
import { users } from "@/db/schemas/user";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { commentDeleterEnum } from "@/db/schemas/enums";

export const comments = pgTable("comment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  content: text("content").notNull(),
  deleter: commentDeleterEnum("deleter"),
  deleteReason: text("deleteReason"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  appId: text("appId")
    .notNull()
    .references(() => apps.id, { onDelete: "cascade" }),
  deletedByUserId: text("deletedByUserId").references(() => users.id, {
    onDelete: "set null",
  }),
  ...timestamps,
});

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
    relationName: "commentAuthor",
  }),
  deletedBy: one(users, {
    fields: [comments.deletedByUserId],
    references: [users.id],
    relationName: "commentDeleter",
  }),
  app: one(apps, {
    fields: [comments.appId],
    references: [apps.id],
  }),
}));
