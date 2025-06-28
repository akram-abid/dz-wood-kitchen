ALTER TABLE "users" RENAME COLUMN "name" TO "fullName";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phoneNumber" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "lastname";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "wilaya";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "daira";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "baladia";