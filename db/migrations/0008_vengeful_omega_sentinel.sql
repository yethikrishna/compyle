CREATE TABLE "image" (
	"id" text PRIMARY KEY NOT NULL,
	"providerFileId" text NOT NULL,
	"url" text NOT NULL,
	"thumbnailUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "app" ADD COLUMN "coverImageId" text;--> statement-breakpoint
ALTER TABLE "app" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "upvote" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "imageId" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "app" ADD CONSTRAINT "app_coverImageId_image_id_fk" FOREIGN KEY ("coverImageId") REFERENCES "public"."image"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_imageId_image_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."image"("id") ON DELETE set null ON UPDATE no action;