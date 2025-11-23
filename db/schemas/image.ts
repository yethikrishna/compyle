import { apps } from "@/db/schemas/app";
import { timestamps } from "@/db/schemas/timestamps";
import { users } from "@/db/schemas/user";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const images = pgTable("image", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  providerFileId: text("providerFileId").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnailUrl").notNull(),
  ...timestamps,
});

export const imagesRelations = relations(images, ({ many }) => ({
  users: many(users),
  apps: many(apps),
}));
