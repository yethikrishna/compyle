CREATE TYPE "public"."CommentDeleter" AS ENUM('author', 'appOwner');--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "deleter" "CommentDeleter";--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "deleteReason" text;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "deletedByUserId" text;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_deletedByUserId_user_id_fk" FOREIGN KEY ("deletedByUserId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;