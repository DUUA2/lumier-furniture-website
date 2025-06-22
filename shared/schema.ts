import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"), // For test authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: text("phone"),
  bvn: text("bvn"),
  nin: text("nin"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  colors: jsonb("colors").$type<string[]>().notNull(),
  dimensions: text("dimensions"),
  material: text("material"),
  weight: text("weight"),
  inStock: boolean("in_stock").default(true),
  availableForPreOrder: boolean("available_for_pre_order").default(false),
  availableForInstallment: boolean("available_for_installment").default(true),
  requiresTruckDelivery: boolean("requires_truck_delivery").default(false),
  customizationOptions: jsonb("customization_options").$type<{
    fabric?: { enabled: boolean; options: string[] };
    color?: { enabled: boolean; options: string[] };
    finish?: { enabled: boolean; options: string[] };
    layout?: { enabled: boolean; options: string[] };
    dimensions?: { enabled: boolean; allowCustom: boolean };
  }>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  monthlyPrice: integer("monthly_price").notNull(),
  itemCount: text("item_count").notNull(),
  swapFrequency: text("swap_frequency").notNull(),
  features: jsonb("features").$type<string[]>().notNull(),
  itemTypes: jsonb("item_types").$type<string[]>().notNull(),
  popular: boolean("popular").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: jsonb("delivery_address").$type<{
    street: string;
    city: string;
    state: string;
  }>().notNull(),
  bvn: text("bvn").notNull(),
  nin: text("nin").notNull(),
  status: text("status").default("active"), // active, paused, cancelled
  refreshFrequency: text("refresh_frequency").default("quarterly").notNull(), // 'quarterly', 'biannual'
  seasonalRefreshEnabled: boolean("seasonal_refresh_enabled").default(true),
  lastRefreshDate: timestamp("last_refresh_date"),
  nextRefreshDate: timestamp("next_refresh_date"),
  startDate: timestamp("start_date").defaultNow(),
  nextSwapDate: timestamp("next_swap_date"),
  monthlyPayment: integer("monthly_payment").notNull(),
  insuranceOptIn: boolean("insurance_opt_in").default(false),
  currentItems: jsonb("current_items").$type<Array<{
    productId: number;
    name: string;
    customizations?: any;
    deliveryDate: string;
  }>>().default([]),
  refreshHistory: jsonb("refresh_history").$type<Array<{
    refreshDate: string;
    previousItems: Array<{productId: number; name: string}>;
    newItems: Array<{productId: number; name: string}>;
    reason: string;
  }>>().default([]),
  emailNotifications: boolean("email_notifications").default(true),
  paymentStatus: text("payment_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  orderType: text("order_type").default("purchase").notNull(), // 'purchase', 'installment', 'subscription'
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: jsonb("delivery_address").$type<{
    street: string;
    city: string;
    state: string;
  }>().notNull(),
  nextOfKin: jsonb("next_of_kin").$type<{
    name: string;
    phone: string;
  }>().notNull(),
  bvn: text("bvn").notNull(),
  nin: text("nin").notNull(),
  items: jsonb("items").$type<Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    type: 'buy' | 'rent' | 'subscription';
    color: string;
    customizations?: any;
  }>>().notNull(),
  subtotal: integer("subtotal").notNull(),
  vat: integer("vat").notNull(),
  insurance: integer("insurance").default(0),
  rentalFees: integer("rental_fees").default(0),
  deliveryFee: integer("delivery_fee").notNull(),
  total: integer("total").notNull(),
  paymentPlan: integer("payment_plan").notNull(),
  monthlyPayment: integer("monthly_payment").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  paystackReference: text("paystack_reference"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  startDate: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
// Newsletter signups for marketing automation
export const newsletterSignups = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  source: text("source").default("website"), // 'website', 'checkout', 'popup'
  preferences: jsonb("preferences").$type<{
    seasonalUpdates: boolean;
    promotions: boolean;
    newArrivals: boolean;
  }>().default({
    seasonalUpdates: true,
    promotions: true,
    newArrivals: true
  }),
  status: text("status").default("active"), // 'active', 'unsubscribed'
  createdAt: timestamp("created_at").defaultNow(),
});

// Seasonal collections for marketing automation
export const seasonalCollections = pgTable("seasonal_collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  season: text("season").notNull(), // 'spring', 'summer', 'fall', 'winter'
  year: integer("year").notNull(),
  isActive: boolean("is_active").default(false),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  bannerText: text("banner_text"),
  featuredProducts: jsonb("featured_products").$type<Array<number>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertNewsletterSignup = typeof newsletterSignups.$inferInsert;
export type NewsletterSignup = typeof newsletterSignups.$inferSelect;
export type InsertSeasonalCollection = typeof seasonalCollections.$inferInsert;
export type SeasonalCollection = typeof seasonalCollections.$inferSelect;
