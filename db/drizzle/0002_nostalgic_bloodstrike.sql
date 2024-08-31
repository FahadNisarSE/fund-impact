ALTER TABLE "PostTable" DROP CONSTRAINT "PostTable_post_id_posts_project_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PostTable" ADD CONSTRAINT "PostTable_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
