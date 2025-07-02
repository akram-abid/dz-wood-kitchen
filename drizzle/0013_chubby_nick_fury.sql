CREATE TYPE "public"."status" AS ENUM('waiting', 'inProgress', 'inShipping', 'delivered');--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET NOT NULL;