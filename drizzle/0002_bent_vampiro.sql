ALTER TABLE "orders" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "is_validated" boolean;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "offer" double precision;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "installments" json;