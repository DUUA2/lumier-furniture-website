import {
  users,
  products,
  orders,
  subscriptions,
  newsletterSignups,
  seasonalCollections,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type Subscription,
  type NewsletterSignup,
  type SeasonalCollection,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUserAccount(userData: { email: string; firstName: string; lastName: string; phone?: string; password: string; }): Promise<User>;
  authenticateUser(email: string, password: string): Promise<User | null>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profileData: any): Promise<User>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  updateOrderPaymentStatus(id: number, status: string, reference?: string): Promise<Order | undefined>;

  // Newsletter operations
  getNewsletterSignup(email: string): Promise<NewsletterSignup | undefined>;
  createNewsletterSignup(signup: any): Promise<NewsletterSignup>;

  // Seasonal collections
  getActiveSeasonalCollection(): Promise<SeasonalCollection | undefined>;

  // Subscription operations
  getUserSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: any): Promise<Subscription>;
  scheduleSubscriptionRefresh(userId: string, refresh: any): Promise<Subscription>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUserAccount(userData: { 
    email: string; 
    firstName: string; 
    lastName: string; 
    phone?: string; 
    password: string; 
  }): Promise<User> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if user already exists
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email,
        password: userData.password, // In production, hash this
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password || user.password !== password) {
      return null;
    }
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First check if user exists by id
    const existingUser = await this.getUser(userData.id);
    
    if (existingUser) {
      // Update existing user
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id))
        .returning();
      return user;
    } else {
      // Create new user
      const [user] = await db
        .insert(users)
        .values(userData)
        .returning();
      return user;
    }
  }

  async updateUserProfile(id: string, profileData: any): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct as any)
      .returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    try {
      const orderData = {
        ...insertOrder,
        items: Array.isArray(insertOrder.items) ? insertOrder.items : []
      };
      const [order] = await db
        .insert(orders)
        .values(orderData as any)
        .returning();
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      if (userId === 'all') {
        // Return all orders for admin
        return await db.select().from(orders);
      }
      return await db.select().from(orders).where(eq(orders.userId, userId));
    } catch (error) {
      console.error("Error fetching orders by user:", error);
      return [];
    }
  }

  async updateOrderPaymentStatus(id: number, status: string, reference?: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({
        paymentStatus: status,
        ...(reference && { paystackReference: reference }),
      })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Newsletter operations
  async getNewsletterSignup(email: string): Promise<any | undefined> {
    try {
      const [signup] = await db.select().from(newsletterSignups).where(eq(newsletterSignups.email, email));
      return signup;
    } catch (error) {
      console.error("Error getting newsletter signup:", error);
      return undefined;
    }
  }

  async createNewsletterSignup(signupData: any): Promise<any> {
    const [signup] = await db
      .insert(newsletterSignups)
      .values(signupData)
      .returning();
    return signup;
  }

  // Seasonal collections
  async getActiveSeasonalCollection(): Promise<any | undefined> {
    try {
      const [collection] = await db
        .select()
        .from(seasonalCollections)
        .where(eq(seasonalCollections.isActive, true))
        .limit(1);
      return collection;
    } catch (error) {
      console.error("Error getting active seasonal collection:", error);
      return undefined;
    }
  }

  // Subscription operations
  async getUserSubscription(userId: string): Promise<any | undefined> {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);
      return subscription;
    } catch (error) {
      console.error("Error getting user subscription:", error);
      return undefined;
    }
  }

  async createSubscription(subscriptionData: any): Promise<any> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  async scheduleSubscriptionRefresh(userId: string, refreshData: any): Promise<any> {
    const [subscription] = await db
      .update(subscriptions)
      .set({
        nextRefreshDate: refreshData.date,
      })
      .where(eq(subscriptions.userId, userId))
      .returning();
    return subscription;
  }
}

export const storage = new DatabaseStorage();