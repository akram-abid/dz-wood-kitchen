ALTER TABLE "orders" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fullName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "media_urls";