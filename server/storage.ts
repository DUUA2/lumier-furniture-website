import { users, products, orders, type User, type UpsertUser, type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
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
  updateOrderPaymentStatus(id: number, status: string, reference?: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private currentProductId: number;
  private currentOrderId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;

    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Omit<Product, 'id' | 'createdAt'>[] = [
      {
        name: 'Modern Sectional Sofa',
        description: 'Comfortable 3-seater with premium fabric',
        price: 85000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#9CA3AF', '#1E3A8A', '#166534', '#7F1D1D', '#A16207', '#581C87'],
        dimensions: '240cm x 160cm x 85cm',
        material: 'Premium Fabric',
        weight: '75kg',
        inStock: true
      },
      {
        name: 'Elegant Dining Table',
        description: 'Solid wood table for 6 people',
        price: 120000,
        category: 'Dining Room',
        image: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937', '#374151'],
        dimensions: '180cm x 90cm x 75cm',
        material: 'Solid Wood',
        weight: '45kg',
        inStock: true
      },
      {
        name: 'Luxury King Bed',
        description: 'Premium upholstered headboard',
        price: 95000,
        category: 'Bedroom',
        image: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#6B7280', '#1F2937', '#92400E', '#7C2D12'],
        dimensions: '200cm x 160cm x 120cm',
        material: 'Upholstered Fabric',
        weight: '50kg',
        inStock: true
      },
      {
        name: 'Designer Coffee Table',
        description: 'Minimalist design with storage',
        price: 45000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937'],
        dimensions: '120cm x 60cm x 45cm',
        material: 'Wood and Glass',
        weight: '25kg',
        inStock: true
      },
      {
        name: 'Designer Accent Chair',
        description: 'Comfortable single seater with elegant design',
        price: 35000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#6B7280', '#1E3A8A', '#166534', '#7F1D1D'],
        dimensions: '75cm x 75cm x 80cm',
        material: 'Upholstered',
        weight: '15kg',
        inStock: true
      },
      {
        name: 'Modern Wardrobe Set',
        description: '3-door wardrobe with mirror',
        price: 75000,
        category: 'Bedroom',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#1F2937', '#92400E', '#374151'],
        dimensions: '150cm x 60cm x 200cm',
        material: 'Engineered Wood',
        weight: '80kg',
        inStock: true
      },
      {
        name: 'Executive Office Desk',
        description: 'Spacious desk with built-in storage',
        price: 55000,
        category: 'Office',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937'],
        dimensions: '140cm x 70cm x 75cm',
        material: 'Wood Veneer',
        weight: '35kg',
        inStock: true
      },
      {
        name: 'Modern Bookshelf',
        description: '5-tier storage solution',
        price: 32000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937', '#374151'],
        dimensions: '80cm x 30cm x 180cm',
        material: 'Engineered Wood',
        weight: '25kg',
        inStock: true
      },
      {
        name: 'Dining Chair Set (4)',
        description: 'Upholstered chairs with wooden legs',
        price: 48000,
        category: 'Dining Room',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#6B7280', '#92400E', '#1F2937'],
        dimensions: '45cm x 50cm x 85cm (each)',
        material: 'Wood and Fabric',
        weight: '8kg (each)',
        inStock: true
      },
      {
        name: 'Bedside Table',
        description: 'Compact table with drawer',
        price: 18000,
        category: 'Bedroom',
        image: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937'],
        dimensions: '40cm x 35cm x 50cm',
        material: 'Engineered Wood',
        weight: '12kg',
        inStock: true
      },
      {
        name: 'Modern TV Stand',
        description: 'Media console with cable management',
        price: 38000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#1F2937', '#92400E'],
        dimensions: '120cm x 40cm x 50cm',
        material: 'Engineered Wood',
        weight: '20kg',
        inStock: true
      },
      {
        name: 'Storage Ottoman',
        description: 'Multipurpose storage and seating',
        price: 22000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#6B7280', '#1E3A8A', '#7F1D1D'],
        dimensions: '60cm x 40cm x 45cm',
        material: 'Upholstered',
        weight: '8kg',
        inStock: true
      },
      {
        name: 'Contemporary Floor Lamp',
        description: 'Adjustable height with LED bulb',
        price: 25000,
        category: 'Lighting',
        image: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#1F2937', '#6B7280'],
        dimensions: '30cm x 30cm x 150cm',
        material: 'Metal and Fabric',
        weight: '5kg',
        inStock: true
      },
      {
        name: 'Bar Stool Set (2)',
        description: 'Adjustable height bar stools',
        price: 28000,
        category: 'Dining Room',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#6B7280', '#1F2937', '#92400E'],
        dimensions: '40cm x 40cm x 60-80cm',
        material: 'Metal and Leather',
        weight: '6kg (each)',
        inStock: true
      },
      {
        name: 'Decorative Mirror Set',
        description: 'Set of 3 wall mirrors',
        price: 15000,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#F4C430', '#1F2937'],
        dimensions: '40cm x 60cm (largest)',
        material: 'Glass and Frame',
        weight: '3kg (set)',
        inStock: true
      },
      {
        name: 'Luxury Lounge Chair',
        description: 'Ergonomic design with premium leather',
        price: 65000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937', '#374151'],
        dimensions: '80cm x 90cm x 100cm',
        material: 'Premium Leather',
        weight: '30kg',
        inStock: true
      },
      {
        name: 'Chest of Drawers',
        description: '5-drawer storage unit',
        price: 42000,
        category: 'Bedroom',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937', '#6B7280'],
        dimensions: '80cm x 45cm x 120cm',
        material: 'Engineered Wood',
        weight: '40kg',
        inStock: true
      },
      {
        name: 'Entryway Console Table',
        description: 'Narrow table perfect for hallways',
        price: 33000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937'],
        dimensions: '100cm x 30cm x 80cm',
        material: 'Solid Wood',
        weight: '18kg',
        inStock: true
      },
      {
        name: 'Classic Rocking Chair',
        description: 'Traditional design with modern comfort',
        price: 29000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#6B7280'],
        dimensions: '70cm x 90cm x 110cm',
        material: 'Wood and Cushion',
        weight: '22kg',
        inStock: true
      },
      {
        name: 'Elegant Side Table',
        description: 'Perfect complement to sofas and chairs',
        price: 18000,
        category: 'Living Room',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        colors: ['#92400E', '#1F2937', '#6B7280'],
        dimensions: '45cm x 45cm x 55cm',
        material: 'Engineered Wood',
        weight: '8kg',
        inStock: true
      }
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // Removed user management for simplified system

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date(),
      userId: insertOrder.userId || null,
      paystackReference: insertOrder.paystackReference || null
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    );
  }

  async updateOrderPaymentStatus(id: number, status: string, reference?: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.paymentStatus = status;
      if (reference) {
        order.paystackReference = reference;
      }
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
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

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async updateOrderPaymentStatus(id: number, status: string, reference?: string): Promise<Order | undefined> {
    const updateData: any = { paymentStatus: status };
    if (reference) {
      updateData.paystackReference = reference;
    }

    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    
    return order || undefined;
  }
}

export const storage = new DatabaseStorage();
