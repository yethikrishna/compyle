import { apps } from "@/db/schemas/app";
import { comments } from "@/db/schemas/comment";
import { userRoleEnum } from "@/db/schemas/enums";
import { images } from "@/db/schemas/image";
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
  imageId: text("imageId").references(() => images.id, {
    onDelete: "set null",
  }),
  role: userRoleEnum("role").notNull().default("user"),
  username: text("username").notNull(),
  displayUsername: text("displayUsername").notNull(),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many, one }) => ({
  apps: many(apps),
  upvotes: many(upvotes),
  comments: many(comments),
  imageReference: one(images, {
    fields: [users.imageId],
    references: [images.id],
  }),
}));
