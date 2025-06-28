CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"description" text NOT NULL,
	"wood_type" text,
	"daira" text NOT NULL,
	"street" text NOT NULL,
	"wilaya" text NOT NULL,
	"phone_number" text NOT NULL,
	"media_urls" json,
	"post_id" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;