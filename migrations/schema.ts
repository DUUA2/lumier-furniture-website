import { pgTable, serial, text, integer, jsonb, boolean, timestamp, unique, varchar, index, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	price: integer().notNull(),
	category: text().notNull(),
	image: text().notNull(),
	colors: jsonb().notNull(),
	dimensions: text(),
	material: text(),
	weight: text(),
	inStock: boolean("in_stock").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	availableForPreOrder: boolean("available_for_pre_order").default(false),
	availableForInstallment: boolean("available_for_installment").default(true),
	requiresTruckDelivery: boolean("requires_truck_delivery").default(false),
	customizationOptions: jsonb("customization_options").default({}),
});

export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	email: varchar(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	profileImageUrl: varchar("profile_image_url"),
	phone: text(),
	bvn: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	nin: text(),
	address: text(),
	city: text(),
	state: text(),
	zipCode: text("zip_code"),
	password: varchar(),
	isActive: boolean("is_active").default(true),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const sessions = pgTable("sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: jsonb().notNull(),
	expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const newsletterSignups = pgTable("newsletter_signups", {
	id: serial().primaryKey().notNull(),
	email: varchar().notNull(),
	source: text().default('website'),
	preferences: jsonb().default({"promotions":true,"newArrivals":true,"seasonalUpdates":true}),
	status: text().default('active'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("newsletter_signups_email_unique").on(table.email),
]);

export const seasonalCollections = pgTable("seasonal_collections", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	season: text().notNull(),
	year: integer().notNull(),
	isActive: boolean("is_active").default(false),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	bannerText: text("banner_text"),
	featuredProducts: jsonb("featured_products").default([]),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const subscriptionPlans = pgTable("subscription_plans", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	monthlyPrice: integer("monthly_price").notNull(),
	itemCount: text("item_count").notNull(),
	swapFrequency: text("swap_frequency").notNull(),
	features: jsonb().notNull(),
	itemTypes: jsonb("item_types").notNull(),
	popular: boolean().default(false),
	active: boolean().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	planId: integer("plan_id").notNull(),
	customerEmail: text("customer_email").notNull(),
	customerName: text("customer_name").notNull(),
	customerPhone: text("customer_phone").notNull(),
	deliveryAddress: jsonb("delivery_address").notNull(),
	bvn: text().notNull(),
	nin: text().notNull(),
	status: text().default('active'),
	refreshFrequency: text("refresh_frequency").default('quarterly').notNull(),
	seasonalRefreshEnabled: boolean("seasonal_refresh_enabled").default(true),
	lastRefreshDate: timestamp("last_refresh_date", { mode: 'string' }),
	nextRefreshDate: timestamp("next_refresh_date", { mode: 'string' }),
	startDate: timestamp("start_date", { mode: 'string' }).defaultNow(),
	nextSwapDate: timestamp("next_swap_date", { mode: 'string' }),
	monthlyPayment: integer("monthly_payment").notNull(),
	insuranceOptIn: boolean("insurance_opt_in").default(false),
	currentItems: jsonb("current_items").default([]),
	refreshHistory: jsonb("refresh_history").default([]),
	emailNotifications: boolean("email_notifications").default(true),
	paymentStatus: text("payment_status").default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.planId],
			foreignColumns: [subscriptionPlans.id],
			name: "subscriptions_plan_id_subscription_plans_id_fk"
		}),
]);

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id"),
	customerEmail: text("customer_email").notNull(),
	customerName: text("customer_name").notNull(),
	customerPhone: text("customer_phone").notNull(),
	deliveryAddress: jsonb("delivery_address").notNull(),
	nextOfKin: jsonb("next_of_kin").notNull(),
	bvn: text().notNull(),
	items: jsonb().notNull(),
	subtotal: integer().notNull(),
	vat: integer().notNull(),
	deliveryFee: integer("delivery_fee").notNull(),
	total: integer().notNull(),
	paymentPlan: integer("payment_plan").notNull(),
	monthlyPayment: integer("monthly_payment").notNull(),
	paymentStatus: text("payment_status").default('pending'),
	paystackReference: text("paystack_reference"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	nin: text().notNull(),
	insurance: integer().default(0),
	rentalFees: integer("rental_fees").default(0),
	orderType: text("order_type").default('purchase').notNull(),
	subscriptionId: integer("subscription_id"),
}, (table) => [
	foreignKey({
			columns: [table.subscriptionId],
			foreignColumns: [subscriptions.id],
			name: "orders_subscription_id_subscriptions_id_fk"
		}),
]);
