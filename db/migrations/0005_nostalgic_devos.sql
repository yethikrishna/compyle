CREATE TABLE "upvote" (
	"userId" text NOT NULL,
	"appId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "upvote_userId_appId_pk" PRIMARY KEY("userId","appId")
);
--> statement-breakpoint
ALTER TABLE "upvote" ADD CONSTRAINT "upvote_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upvote" ADD CONSTRAINT "upvote_appId_app_id_fk" FOREIGN KEY ("appId") REFERENCES "public"."app"("id") ON DELETE cascade ON UPDATE no action;