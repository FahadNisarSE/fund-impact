ALTER TABLE "projects" ADD COLUMN "project_duration" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_account" ADD CONSTRAINT "payment_account_stripe_account_id_unique" UNIQUE("stripe_account_id");