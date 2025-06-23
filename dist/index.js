var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  insertSubscriptionPlanSchema: () => insertSubscriptionPlanSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  newsletterSignups: () => newsletterSignups,
  orders: () => orders,
  products: () => products,
  seasonalCollections: () => seasonalCollections,
  sessions: () => sessions,
  subscriptionPlans: () => subscriptionPlans,
  subscriptions: () => subscriptions,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"),
  // For test authentication
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
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  colors: jsonb("colors").$type().notNull(),
  dimensions: text("dimensions"),
  material: text("material"),
  weight: text("weight"),
  inStock: boolean("in_stock").default(true),
  availableForPreOrder: boolean("available_for_pre_order").default(false),
  availableForInstallment: boolean("available_for_installment").default(true),
  requiresTruckDelivery: boolean("requires_truck_delivery").default(false),
  customizationOptions: jsonb("customization_options").$type().default({}),
  createdAt: timestamp("created_at").defaultNow()
});
var subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  monthlyPrice: integer("monthly_price").notNull(),
  itemCount: text("item_count").notNull(),
  swapFrequency: text("swap_frequency").notNull(),
  features: jsonb("features").$type().notNull(),
  itemTypes: jsonb("item_types").$type().notNull(),
  popular: boolean("popular").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: jsonb("delivery_address").$type().notNull(),
  bvn: text("bvn").notNull(),
  nin: text("nin").notNull(),
  status: text("status").default("active"),
  // active, paused, cancelled
  refreshFrequency: text("refresh_frequency").default("quarterly").notNull(),
  // 'quarterly', 'biannual'
  seasonalRefreshEnabled: boolean("seasonal_refresh_enabled").default(true),
  lastRefreshDate: timestamp("last_refresh_date"),
  nextRefreshDate: timestamp("next_refresh_date"),
  startDate: timestamp("start_date").defaultNow(),
  nextSwapDate: timestamp("next_swap_date"),
  monthlyPayment: integer("monthly_payment").notNull(),
  insuranceOptIn: boolean("insurance_opt_in").default(false),
  currentItems: jsonb("current_items").$type().default([]),
  refreshHistory: jsonb("refresh_history").$type().default([]),
  emailNotifications: boolean("email_notifications").default(true),
  paymentStatus: text("payment_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  orderType: text("order_type").default("purchase").notNull(),
  // 'purchase', 'installment', 'subscription'
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: jsonb("delivery_address").$type().notNull(),
  nextOfKin: jsonb("next_of_kin").$type().notNull(),
  bvn: text("bvn").notNull(),
  nin: text("nin").notNull(),
  items: jsonb("items").$type().notNull(),
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
  createdAt: timestamp("created_at").defaultNow()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});
var insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  startDate: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true
});
var newsletterSignups = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  source: text("source").default("website"),
  // 'website', 'checkout', 'popup'
  preferences: jsonb("preferences").$type().default({
    seasonalUpdates: true,
    promotions: true,
    newArrivals: true
  }),
  status: text("status").default("active"),
  // 'active', 'unsubscribed'
  createdAt: timestamp("created_at").defaultNow()
});
var seasonalCollections = pgTable("seasonal_collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  season: text("season").notNull(),
  // 'spring', 'summer', 'fall', 'winter'
  year: integer("year").notNull(),
  isActive: boolean("is_active").default(false),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  bannerText: text("banner_text"),
  featuredProducts: jsonb("featured_products").$type().default([]),
  createdAt: timestamp("created_at").defaultNow()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUserAccount(userData) {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    const [user] = await db.insert(users).values({
      id: userId,
      email: userData.email,
      password: userData.password,
      // In production, hash this
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || null,
      isActive: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return user;
  }
  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password || user.password !== password) {
      return null;
    }
    return user;
  }
  async upsertUser(userData) {
    const existingUser = await this.getUser(userData.id);
    if (existingUser) {
      const [user] = await db.update(users).set({
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, userData.id)).returning();
      return user;
    } else {
      const [user] = await db.insert(users).values(userData).returning();
      return user;
    }
  }
  async updateUserProfile(id, profileData) {
    const [user] = await db.update(users).set({
      ...profileData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, id)).returning();
    return user;
  }
  // Products
  async getProducts() {
    return await db.select().from(products);
  }
  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  async getProductsByCategory(category) {
    return await db.select().from(products).where(eq(products.category, category));
  }
  async createProduct(insertProduct) {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  async updateProduct(id, updates) {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return product;
  }
  async deleteProduct(id) {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Orders
  async createOrder(insertOrder) {
    try {
      const orderData = {
        ...insertOrder,
        items: Array.isArray(insertOrder.items) ? insertOrder.items : []
      };
      const [order] = await db.insert(orders).values(orderData).returning();
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  async getOrdersByUser(userId) {
    try {
      if (userId === "all") {
        return await db.select().from(orders);
      }
      return await db.select().from(orders).where(eq(orders.userId, userId));
    } catch (error) {
      console.error("Error fetching orders by user:", error);
      return [];
    }
  }
  async updateOrderPaymentStatus(id, status, reference) {
    const [order] = await db.update(orders).set({
      paymentStatus: status,
      ...reference && { paystackReference: reference }
    }).where(eq(orders.id, id)).returning();
    return order;
  }
  // Newsletter operations
  async getNewsletterSignup(email) {
    try {
      const [signup] = await db.select().from(newsletterSignups).where(eq(newsletterSignups.email, email));
      return signup;
    } catch (error) {
      console.error("Error getting newsletter signup:", error);
      return void 0;
    }
  }
  async createNewsletterSignup(signupData) {
    const [signup] = await db.insert(newsletterSignups).values(signupData).returning();
    return signup;
  }
  // Seasonal collections
  async getActiveSeasonalCollection() {
    try {
      const [collection] = await db.select().from(seasonalCollections).where(eq(seasonalCollections.isActive, true)).limit(1);
      return collection;
    } catch (error) {
      console.error("Error getting active seasonal collection:", error);
      return void 0;
    }
  }
  // Subscription operations
  async getUserSubscription(userId) {
    try {
      const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
      return subscription;
    } catch (error) {
      console.error("Error getting user subscription:", error);
      return void 0;
    }
  }
  async createSubscription(subscriptionData) {
    const [subscription] = await db.insert(subscriptions).values(subscriptionData).returning();
    return subscription;
  }
  async scheduleSubscriptionRefresh(userId, refreshData) {
    const [subscription] = await db.update(subscriptions).set({
      nextRefreshDate: refreshData.date
    }).where(eq(subscriptions.userId, userId)).returning();
    return subscription;
  }
};
var storage = new DatabaseStorage();

// server/config.ts
var PAYMENT_CONFIG = {
  // VAT rate (7.5% for Nigeria)
  VAT_RATE: 0.075,
  // Down payment percentage (70% of total cost)
  DOWN_PAYMENT_RATE: 0.7,
  // Remaining balance rate (30% of total cost)
  REMAINING_BALANCE_RATE: 0.3,
  // Monthly service fee rate for installments (5% per month on remaining balance)
  SERVICE_FEE_RATE: 0.05,
  // Insurance options
  INSURANCE: {
    ENABLED: true,
    RATE: 0.02,
    // 2% of item value
    DESCRIPTION: "Comprehensive protection for your furniture"
  },
  // Delivery fees by state
  DELIVERY_FEES: {
    "Lagos": 3e3,
    "Abuja": 4e3,
    "Port Harcourt": 5e3,
    "Kano": 6e3,
    "Ibadan": 4500,
    "Kaduna": 5500,
    "Jos": 6e3,
    "Enugu": 5e3,
    "Benin": 4500,
    "Warri": 5e3,
    "DEFAULT": 5e3
  },
  // Updated installment payment plan options (2-6 months for remaining 30%)
  INSTALLMENT_PLANS: [
    { value: "2", label: "2 Months", months: 2 },
    { value: "3", label: "3 Months", months: 3 },
    { value: "4", label: "4 Months", months: 4 },
    { value: "5", label: "5 Months", months: 5 },
    { value: "6", label: "6 Months", months: 6 }
  ]
};

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      // Allow http in development
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  if (process.env.AUTH_DISABLED === "true") {
    req.user = {
      claims: {
        sub: "test-user-id",
        email: "test@example.com"
      }
    };
    return next();
  }
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/email.ts
import { MailService } from "@sendgrid/mail";
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set - email notifications disabled");
}
var mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}
async function sendEmail(params) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("Email would be sent:", params.subject, "to", params.to);
    return false;
  }
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || "",
      html: params.html || ""
    });
    console.log("Email sent successfully to:", params.to);
    return true;
  } catch (error) {
    console.error("SendGrid email error:", error);
    return false;
  }
}
async function sendOrderConfirmationEmail(order) {
  const orderItems = Array.isArray(order.items) ? order.items : [];
  const deliveryAddress = order.deliveryAddress || { street: "", city: "", state: "" };
  const itemsHtml = orderItems.map((item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">\u20A6${item.price.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.type === "buy" ? "Purchase" : "Rental"}</td>
    </tr>
  `).join("");
  const paymentPlanText = order.paymentPlan === 1 ? "Full Payment" : `${order.paymentPlan} Month Installment`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Lumiere Furniture</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #D4AF37; margin: 0;">Lumiere Furniture</h1>
        <p style="color: #666; margin: 5px 0;">RC: 3662809</p>
      </div>
      
      <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Order Confirmation</h2>
      
      <p>Dear ${order.customerName},</p>
      <p>Thank you for your order! We've received your purchase and are processing it now.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #D4AF37;">Order Details</h3>
        <p><strong>Order Number:</strong> LUM-${order.id.toString().padStart(6, "0")}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt || /* @__PURE__ */ new Date()).toLocaleDateString()}</p>
        <p><strong>Payment Plan:</strong> ${paymentPlanText}</p>
        <p><strong>Total Amount:</strong> \u20A6${order.total.toLocaleString()}</p>
      </div>

      <h3 style="color: #333;">Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr style="background: #D4AF37; color: white;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
            <th style="padding: 10px; text-align: center;">Type</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Delivery Address</h3>
        <p>${deliveryAddress.street || "N/A"}<br>
        ${deliveryAddress.city || "N/A"}, ${deliveryAddress.state || "N/A"}</p>
      </div>

      <div style="background: #fff9e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #D4AF37;">What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>We'll process your order within 1-2 business days</li>
          <li>You'll receive a delivery confirmation with tracking details</li>
          <li>Our team will contact you to schedule delivery</li>
          <li>For installment plans, payment reminders will be sent monthly</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666;">Questions about your order? Contact us at support@lumierfurniture.com</p>
        <p style="color: #666; font-size: 12px;">Lumiere Furniture - Premium Nigerian Furniture Solutions</p>
      </div>
    </body>
    </html>
  `;
  const textContent = `
Order Confirmation - Lumiere Furniture

Dear ${order.customerName},

Thank you for your order! We've received your purchase and are processing it now.

Order Details:
- Order Number: LUM-${order.id.toString().padStart(6, "0")}
- Order Date: ${new Date(order.createdAt || /* @__PURE__ */ new Date()).toLocaleDateString()}
- Payment Plan: ${paymentPlanText}
- Total Amount: \u20A6${order.total.toLocaleString()}

Items Ordered:
${orderItems.map((item) => `- ${item.name} (Qty: ${item.quantity}) - \u20A6${item.price.toLocaleString()} - ${item.type === "buy" ? "Purchase" : "Rental"}`).join("\n")}

Delivery Address:
${deliveryAddress.street || "N/A"}
${deliveryAddress.city || "N/A"}, ${deliveryAddress.state || "N/A"}

What's Next?
- We'll process your order within 1-2 business days
- You'll receive a delivery confirmation with tracking details
- Our team will contact you to schedule delivery
- For installment plans, payment reminders will be sent monthly

Questions about your order? Contact us at support@lumierfurniture.com

Lumiere Furniture - Premium Nigerian Furniture Solutions
RC: 3662809
  `;
  return await sendEmail({
    to: order.customerEmail,
    from: "orders@lumierfurniture.com",
    subject: `Order Confirmation - LUM-${order.id.toString().padStart(6, "0")} - Lumiere Furniture`,
    text: textContent,
    html: htmlContent
  });
}
async function sendAdminNotificationEmail(order) {
  const orderItems = Array.isArray(order.items) ? order.items : [];
  const deliveryAddress = order.deliveryAddress || { street: "", city: "", state: "" };
  const paymentPlanText = order.paymentPlan === 1 ? "Full Payment" : `${order.paymentPlan} Month Installment`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Received - Lumiere Furniture Admin</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc2626; color: white; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0;">\u{1F6D2} NEW ORDER RECEIVED</h1>
        <p style="margin: 5px 0;">Lumiere Furniture Admin Notification</p>
      </div>
      
      <h2 style="color: #dc2626;">Order #LUM-${order.id.toString().padStart(6, "0")}</h2>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Customer Information</h3>
        <p><strong>Name:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>BVN:</strong> ${order.bvn}</p>
        <p><strong>NIN:</strong> ${order.nin}</p>
      </div>

      <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Order Summary</h3>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt || /* @__PURE__ */ new Date()).toLocaleString()}</p>
        <p><strong>Payment Plan:</strong> ${paymentPlanText}</p>
        <p><strong>Total Amount:</strong> \u20A6${order.total.toLocaleString()}</p>
        <p><strong>Delivery Fee:</strong> \u20A6${order.deliveryFee.toLocaleString()}</p>
      </div>

      <h3 style="color: #dc2626;">Items Ordered</h3>
      ${orderItems.map((item) => `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
          <p><strong>${item.name}</strong></p>
          <p>Quantity: ${item.quantity} | Price: \u20A6${item.price.toLocaleString()} | Type: ${item.type === "buy" ? "Purchase" : "Rental"}</p>
          <p>Color: ${item.color}</p>
        </div>
      `).join("")}

      <div style="background: #fff9e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Delivery Address</h3>
        <p>${deliveryAddress.street || "N/A"}<br>
        ${deliveryAddress.city || "N/A"}, ${deliveryAddress.state || "N/A"}</p>
      </div>

      <div style="background: #f0fff0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Action Required</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Process order within 1-2 business days</li>
          <li>Verify customer information and payment details</li>
          <li>Schedule delivery and contact customer</li>
          <li>Update inventory for ordered items</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666;">Login to admin panel to manage this order</p>
      </div>
    </body>
    </html>
  `;
  return await sendEmail({
    to: "admin@lumierfurniture.com",
    // Admin email - you can customize this
    from: "system@lumierfurniture.com",
    subject: `\u{1F6D2} NEW ORDER: LUM-${order.id.toString().padStart(6, "0")} - \u20A6${order.total.toLocaleString()}`,
    html: htmlContent
  });
}

// server/routes.ts
async function registerRoutes(app2) {
  if (process.env.AUTH_DISABLED !== "true") {
    await setupAuth(app2);
  }
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      const user = await storage.createUserAccount({
        email,
        password,
        firstName,
        lastName,
        phone
      });
      req.session.userId = user.id;
      req.session.user = user;
      res.json({
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.session.userId = user.id;
      req.session.user = user;
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/auth/current-user", (req, res) => {
    if (process.env.AUTH_DISABLED === "true") {
      return res.json({
        id: "test-user-id",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        phone: "+234 123 456 7890"
      });
    }
    const userId = req.session?.userId;
    const user = req.session?.user;
    if (!userId || !user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    });
  });
  app2.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = req.body;
      const updatedUser = await storage.updateUserProfile(userId, profileData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      console.log("Fetching products from storage...");
      const products2 = await storage.getProducts();
      console.log(`Successfully fetched ${products2.length} products`);
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      const errorMessage = error?.message || "Unknown error";
      res.status(500).json({ error: "Failed to fetch products", details: errorMessage });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });
  app2.get("/api/products/category/:category", async (req, res) => {
    try {
      const category = decodeURIComponent(req.params.category);
      const products2 = await storage.getProductsByCategory(category);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  app2.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const validatedOrder = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedOrder);
      Promise.all([
        sendOrderConfirmationEmail(order),
        sendAdminNotificationEmail(order)
      ]).catch((error) => {
        console.error("Failed to send email notifications:", error);
      });
      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  app2.patch("/api/orders/:id/payment", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reference } = req.body;
      const order = await storage.updateOrderPaymentStatus(id, status, reference);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order payment status" });
    }
  });
  app2.get("/api/delivery-fee/:state", async (req, res) => {
    const stateName = req.params.state.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    const fee = PAYMENT_CONFIG.DELIVERY_FEES[stateName] || PAYMENT_CONFIG.DELIVERY_FEES.DEFAULT;
    res.json({ fee });
  });
  app2.get("/api/payment-config", async (req, res) => {
    res.json(PAYMENT_CONFIG);
  });
  app2.post("/api/newsletter/signup", async (req, res) => {
    try {
      const { email, source, preferences } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const existingSignup = await storage.getNewsletterSignup(email);
      if (existingSignup) {
        return res.status(409).json({ message: "Email already subscribed" });
      }
      const signup = await storage.createNewsletterSignup({
        email,
        source: source || "website",
        preferences: preferences || {
          seasonalUpdates: true,
          promotions: true,
          newArrivals: true
        }
      });
      res.json(signup);
    } catch (error) {
      console.error("Newsletter signup error:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });
  app2.get("/api/seasonal-collections/active", async (req, res) => {
    try {
      const activeCollection = await storage.getActiveSeasonalCollection();
      res.json(activeCollection);
    } catch (error) {
      console.error("Error fetching active seasonal collection:", error);
      res.status(500).json({ message: "Failed to fetch seasonal collection" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Email, password, first name, and last name are required" });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      const newUser = await storage.createUserAccount({
        email,
        password,
        firstName,
        lastName,
        phone: phone || ""
      });
      req.session.userId = newUser.id;
      req.session.user = newUser;
      res.json({
        message: "Account created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone
        }
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.session.userId = user.id;
      req.session.user = user;
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    try {
      req.session.userId = null;
      req.session.user = null;
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });
  app2.get("/api/subscription/current", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const subscription = await storage.getUserSubscription(userId);
      if (!subscription) {
        return res.status(404).json({ message: "No active subscription found" });
      }
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });
  app2.get("/api/orders/user", isAuthenticated, async (req, res) => {
    try {
      let userId = req.user?.claims?.sub;
      if (process.env.AUTH_DISABLED === "true") {
        userId = "test-user-id";
      }
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const orders2 = await storage.getOrdersByUser(userId);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.post("/api/create-test-user", async (req, res) => {
    try {
      const { email, firstName, lastName, phone } = req.body;
      if (!email || !firstName) {
        return res.status(400).json({ error: "Email and first name are required" });
      }
      const existingUser = await storage.getUser(email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }
      const newUser = await storage.upsertUser({
        id: email,
        email,
        firstName,
        lastName: lastName || "",
        phone: phone || ""
      });
      res.json({
        message: "Test user created successfully",
        user: newUser
      });
    } catch (error) {
      console.error("Error creating test user:", error);
      res.status(500).json({ error: "Failed to create test user" });
    }
  });
  app2.post("/api/test-login", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const user = await storage.getUser(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      req.session.user = user;
      res.json({
        message: "Login successful",
        user
      });
    } catch (error) {
      console.error("Error during test login:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });
  app2.post("/api/create-test-order", async (req, res) => {
    try {
      const { userEmail } = req.body;
      if (!userEmail) {
        return res.status(400).json({ error: "User email is required" });
      }
      const user = await storage.getUser(userEmail);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const products2 = await storage.getProducts();
      const sampleProduct = products2[0];
      if (!sampleProduct) {
        return res.status(500).json({ error: "No products available for test order" });
      }
      const testOrder = await storage.createOrder({
        userId: user.id,
        orderType: "installment",
        customerEmail: user.email || "",
        customerName: `${user.firstName} ${user.lastName}`.trim(),
        customerPhone: user.phone || "+234 123 456 7890",
        deliveryAddress: {
          street: "123 Test Street",
          city: "Lagos",
          state: "Lagos"
        },
        nextOfKin: {
          name: "Test Next of Kin",
          phone: "+234 987 654 3210"
        },
        bvn: "12345678901",
        nin: "12345678901234",
        items: [{
          productId: sampleProduct.id,
          name: sampleProduct.name,
          price: sampleProduct.price,
          quantity: 1,
          type: "buy",
          color: sampleProduct.colors[0] || "Brown"
        }],
        subtotal: sampleProduct.price,
        vat: Math.round(sampleProduct.price * 0.075),
        insurance: 0,
        rentalFees: 0,
        deliveryFee: 15e3,
        total: sampleProduct.price + Math.round(sampleProduct.price * 0.075) + 15e3,
        paymentPlan: 6,
        monthlyPayment: Math.round(sampleProduct.price * 0.3 / 6),
        paymentStatus: "pending"
      });
      res.json({
        message: "Test order created successfully",
        order: testOrder
      });
    } catch (error) {
      console.error("Error creating test order:", error);
      res.status(500).json({ error: "Failed to create test order" });
    }
  });
  app2.post("/api/orders/:id/pay-remaining", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (order.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to access this order" });
      }
      const updatedOrder = await storage.updateOrderPaymentStatus(orderId, "completed");
      if (!updatedOrder) {
        return res.status(500).json({ error: "Failed to update payment status" });
      }
      res.json({
        message: "Payment successful",
        order: updatedOrder
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  });
  app2.post("/api/subscription/schedule-refresh", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { date, reason } = req.body;
      if (!date || !reason) {
        return res.status(400).json({ message: "Date and reason are required" });
      }
      const updatedSubscription = await storage.scheduleSubscriptionRefresh(userId, {
        date: new Date(date),
        reason
      });
      res.json(updatedSubscription);
    } catch (error) {
      console.error("Error scheduling refresh:", error);
      res.status(500).json({ message: "Failed to schedule refresh" });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      const orders2 = await storage.getOrdersByUser("all");
      const totalRevenue = orders2.reduce((sum, order) => sum + (order.total || 0), 0);
      const stats = {
        totalProducts: products2.length,
        totalOrders: orders2.length,
        totalRevenue,
        activeSubscriptions: 0
        // TODO: implement subscription counting
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const orders2 = await storage.getOrdersByUser("all");
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.put("/api/admin/settings", async (req, res) => {
    try {
      const settings = req.body;
      res.json({ message: "Settings updated successfully", settings });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });
  app2.post("/api/subscription/create", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { planType, refreshFrequency, customerInfo, deliveryAddress } = req.body;
      const subscription = await storage.createSubscription({
        userId,
        planType,
        refreshFrequency: refreshFrequency || "quarterly",
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        deliveryAddress,
        bvn: customerInfo.bvn,
        nin: customerInfo.nin,
        monthlyPayment: planType === "basic" ? 15e3 : planType === "premium" ? 25e3 : 4e4,
        seasonalRefreshEnabled: true,
        nextRefreshDate: new Date(Date.now() + (refreshFrequency === "quarterly" ? 90 : 180) * 24 * 60 * 60 * 1e3)
      });
      res.json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clients = /* @__PURE__ */ new Map();
  wss.on("connection", (ws2) => {
    console.log("New WebSocket connection");
    clients.set(ws2, {});
    ws2.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "message") {
          const clientInfo = clients.get(ws2) || {};
          clientInfo.userId = message.userId;
          clientInfo.userName = message.senderName;
          clients.set(ws2, clientInfo);
          const broadcastMessage = {
            type: "message",
            id: message.id,
            text: message.text,
            sender: message.sender,
            timestamp: message.timestamp,
            senderName: message.senderName
          };
          if (ws2.readyState === WebSocket.OPEN) {
            if (message.sender === "user") {
              setTimeout(() => {
                const supportReply = generateSupportReply(message.text);
                if (ws2.readyState === WebSocket.OPEN) {
                  ws2.send(JSON.stringify({
                    type: "message",
                    id: Date.now().toString(),
                    text: supportReply,
                    sender: "support",
                    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                    senderName: "Lumiere Support"
                  }));
                }
              }, 1e3 + Math.random() * 2e3);
            }
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws2.on("close", () => {
      clients.delete(ws2);
      console.log("WebSocket connection closed");
    });
    ws2.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws2);
    });
  });
  function generateSupportReply(userMessage) {
    const message = userMessage.toLowerCase();
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! Thank you for contacting Lumiere Furniture. How can I help you today?";
    }
    if (message.includes("price") || message.includes("cost") || message.includes("payment")) {
      return "Our furniture comes with flexible payment options including monthly installments and rent-to-own plans. Would you like me to explain our payment plans?";
    }
    if (message.includes("delivery") || message.includes("shipping")) {
      return "We offer delivery across Nigeria. Delivery fees vary by state. Lagos delivery is \u20A615,000, while other states range from \u20A620,000-\u20A635,000. What's your location?";
    }
    if (message.includes("warranty") || message.includes("guarantee")) {
      return "All our furniture comes with a 2-year warranty. We also offer optional insurance for rental items at 2% of the item value. Would you like more details?";
    }
    if (message.includes("rent") || message.includes("rental")) {
      return "Our rent-to-own program allows you to enjoy furniture immediately with just 1% monthly rental fees. You can purchase anytime during the rental period. Which items interest you?";
    }
    if (message.includes("bvn") || message.includes("nin") || message.includes("verification")) {
      return "For security and Nigerian compliance, we require BVN and NIN verification for all purchases and rentals. This helps us serve you better and ensures secure transactions.";
    }
    if (message.includes("return") || message.includes("exchange")) {
      return "We have a 7-day return policy for purchases and flexible exchange options for rental items. Please check our Returns page for full details.";
    }
    if (message.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with regarding our furniture or services?";
    }
    const defaultReplies = [
      "I understand your inquiry. Let me connect you with our specialist who can provide detailed information about our furniture and services.",
      "Thank you for your question. Our team will be happy to assist you with personalized recommendations based on your needs.",
      "That's a great question! Our furniture experts can provide you with detailed information and help you find the perfect pieces for your space.",
      "I'd be happy to help you with that. Our customer service team specializes in Nigerian furniture solutions and payment plans."
    ];
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  }
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath2 = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath2)) {
    throw new Error(
      `Could not find the build directory: ${distPath2}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath2));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath2, "index.html"));
  });
}

// server/index.ts
import path3 from "path";
import { fileURLToPath } from "url";

// server/products.ts
import { Router } from "express";
var router = Router();
router.get("/", async (req, res) => {
  try {
    const result = await db.select().from(products);
    res.json(result);
  } catch (err) {
    console.error("\u274C Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
var products_default = router;

// server/index.ts
process.env.AUTH_DISABLED = "true";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
if (process.env.AUTH_DISABLED !== "true") {
  app.use(getSession());
}
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.use("/api/products", products_default);
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
var distPath = path3.join(__dirname, "../dist/public");
app.use(express2.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path3.join(distPath, "index.html"));
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
