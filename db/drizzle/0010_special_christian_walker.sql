ALTER TABLE "chatChannel" ADD PRIMARY KEY ("channel_id");--> statement-breakpoint
ALTER TABLE "chatChannel" ALTER COLUMN "channel_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "chatChannel" ALTER COLUMN "channel_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "chatChannel" ALTER COLUMN "channel_id" SET NOT NULL;