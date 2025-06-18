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
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
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
    type: 'buy' | 'rent';
    color: string;
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

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
