ALTER TABLE "comment" DROP CONSTRAINT "comment_deletedByUserId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_deletedByUserId_user_id_fk" FOREIGN KEY ("deletedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;