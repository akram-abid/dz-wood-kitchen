ALTER TABLE "posts" ALTER COLUMN "items" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_number" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "estimated_time";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_tracking_number_unique" UNIQUE("tracking_number");