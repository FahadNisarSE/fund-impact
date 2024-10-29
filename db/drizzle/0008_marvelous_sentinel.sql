CREATE TABLE IF NOT EXISTS "chatChannel" (
	"channel_id" uuid DEFAULT gen_random_uuid(),
	"userId1" uuid NOT NULL,
	"userId2" uuid NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "user_type" SET DEFAULT 'Supporter';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatChannel" ADD CONSTRAINT "chatChannel_userId1_user_id_fk" FOREIGN KEY ("userId1") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatChannel" ADD CONSTRAINT "chatChannel_userId2_user_id_fk" FOREIGN KEY ("userId2") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
