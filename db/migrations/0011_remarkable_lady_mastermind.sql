ALTER TABLE "app" RENAME COLUMN "coverImage" TO "image";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "imageId" TO "imageProviderFileId";--> statement-breakpoint
ALTER TABLE "app" DROP CONSTRAINT "app_coverImageId_image_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_imageId_image_id_fk";
--> statement-breakpoint
ALTER TABLE "app" DROP COLUMN "coverImageId";