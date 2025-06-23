-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"category" text NOT NULL,
	"image" text NOT NULL,
	"colors" jsonb NOT NULL,
	"dimensions" text,
	"material" text,
	"weight" text,
	"in_stock" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"available_for_pre_order" boolean DEFAULT false,
	"available_for_installment" boolean DEFAULT true,
	"requires_truck_delivery" boolean DEFAULT false,
	"customization_options" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"phone" text,
	"bvn" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"nin" text,
	"address" text,
	"city" text,
	"state" text,
	"zip_code" text,
	"password" varchar,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"source" text DEFAULT 'website',
	"preferences" jsonb DEFAULT '{"promotions":true,"newArrivals":true,"seasonalUpdates":true}'::jsonb,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "newsletter_signups_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "seasonal_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"season" text NOT NULL,
	"year" integer NOT NULL,
	"is_active" boolean DEFAULT false,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"banner_text" text,
	"featured_products" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"monthly_price" integer NOT NULL,
	"item_count" text NOT NULL,
	"swap_frequency" text NOT NULL,
	"features" jsonb NOT NULL,
	"item_types" jsonb NOT NULL,
	"popular" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"plan_id" integer NOT NULL,
	"customer_email" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"delivery_address" jsonb NOT NULL,
	"bvn" text NOT NULL,
	"nin" text NOT NULL,
	"status" text DEFAULT 'active',
	"refresh_frequency" text DEFAULT 'quarterly' NOT NULL,
	"seasonal_refresh_enabled" boolean DEFAULT true,
	"last_refresh_date" timestamp,
	"next_refresh_date" timestamp,
	"start_date" timestamp DEFAULT now(),
	"next_swap_date" timestamp,
	"monthly_payment" integer NOT NULL,
	"insurance_opt_in" boolean DEFAULT false,
	"current_items" jsonb DEFAULT '[]'::jsonb,
	"refresh_history" jsonb DEFAULT '[]'::jsonb,
	"email_notifications" boolean DEFAULT true,
	"payment_status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"customer_email" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"delivery_address" jsonb NOT NULL,
	"next_of_kin" jsonb NOT NULL,
	"bvn" text NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" integer NOT NULL,
	"vat" integer NOT NULL,
	"delivery_fee" integer NOT NULL,
	"total" integer NOT NULL,
	"payment_plan" integer NOT NULL,
	"monthly_payment" integer NOT NULL,
	"payment_status" text DEFAULT 'pending',
	"paystack_reference" text,
	"created_at" timestamp DEFAULT now(),
	"nin" text NOT NULL,
	"insurance" integer DEFAULT 0,
	"rental_fees" integer DEFAULT 0,
	"order_type" text DEFAULT 'purchase' NOT NULL,
	"subscription_id" integer
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire" timestamp_ops);
*/