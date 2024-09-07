ALTER TABLE "support" ADD COLUMN "stripe_session_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "support" ADD COLUMN "verified" boolean DEFAULT false;