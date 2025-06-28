CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "admins" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "admins" CASCADE;--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "admin_id" TO "created_by";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_admin_id_admins_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;