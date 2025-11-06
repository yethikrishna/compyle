ALTER TABLE "app" RENAME COLUMN "tags" TO "category";--> statement-breakpoint
ALTER TABLE "app" ADD COLUMN "builtWith" text[] DEFAULT '{}' NOT NULL;