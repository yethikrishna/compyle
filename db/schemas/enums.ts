import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("UserRole", ["user", "admin"]);
export const appStatusEnum = pgEnum("AppStatus", [
  "draft",
  "archived",
  "published",
]);
