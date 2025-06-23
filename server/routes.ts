import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { PAYMENT_CONFIG } from "./config";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication (disabled when AUTH_DISABLED=true)
  if (process.env.AUTH_DISABLED !== 'true') {
    await setupAuth(app);
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Local authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Create new user (storage layer handles duplicate check)
      const user = await storage.createUserAccount({
        email,
        password,
        firstName,
        lastName,
        phone
      });

      // Store user session
      (req.session as any).userId = user.id;
      (req.session as any).user = user;

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

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Store user session
      (req.session as any).userId = user.id;
      (req.session as any).user = user;

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

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/auth/current-user', (req, res) => {
    // Bypass authentication if disabled
    if (process.env.AUTH_DISABLED === 'true') {
      return res.json({
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '+234 123 456 7890'
      });
    }

    const userId = (req.session as any)?.userId;
    const user = (req.session as any)?.user;
    
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

  // Profile update route
  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = req.body;
      
      // Update user profile with new data
      const updatedUser = await storage.updateUserProfile(userId, profileData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
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

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const category = decodeURIComponent(req.params.category);
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  });

  // Create new product
  app.post("/api/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update existing product
  app.patch("/api/products/:id", async (req, res) => {
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

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
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

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedOrder = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedOrder);
      
      // Send email notifications (async, don't block response)
      Promise.all([
        sendOrderConfirmationEmail(order),
        sendAdminNotificationEmail(order)
      ]).catch(error => {
        console.error("Failed to send email notifications:", error);
      });
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
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

  app.patch("/api/orders/:id/payment", async (req, res) => {
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

  // Delivery fee calculation
  app.get("/api/delivery-fee/:state", async (req, res) => {
    const stateName = req.params.state
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const fee = (PAYMENT_CONFIG.DELIVERY_FEES as any)[stateName] || PAYMENT_CONFIG.DELIVERY_FEES.DEFAULT;
    
    res.json({ fee });
  });

  // Payment configuration endpoint for frontend
  app.get("/api/payment-config", async (req, res) => {
    res.json(PAYMENT_CONFIG);
  });

  // Newsletter signup endpoint
  app.post("/api/newsletter/signup", async (req, res) => {
    try {
      const { email, source, preferences } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if email already exists
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

  // Get active seasonal collection
  app.get("/api/seasonal-collections/active", async (req, res) => {
    try {
      const activeCollection = await storage.getActiveSeasonalCollection();
      res.json(activeCollection);
    } catch (error) {
      console.error("Error fetching active seasonal collection:", error);
      res.status(500).json({ message: "Failed to fetch seasonal collection" });
    }
  });

  // Local authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Email, password, first name, and last name are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create new user account
      const newUser = await storage.createUserAccount({
        email,
        password,
        firstName,
        lastName,
        phone: phone || ''
      });

      // Set user session
      (req.session as any).userId = newUser.id;
      (req.session as any).user = newUser;
      
      res.json({ 
        message: 'Account created successfully', 
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone
        }
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Failed to create account' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Authenticate user
      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Set user session
      (req.session as any).userId = user.id;
      (req.session as any).user = user;
      
      res.json({ 
        message: 'Login successful', 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Failed to login' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    try {
      // Clear session
      (req.session as any).userId = null;
      (req.session as any).user = null;
      
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ message: 'Failed to logout' });
    }
  });

  // Get current user subscription
  app.get("/api/subscription/current", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
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

  // Get user's orders
  app.get('/api/orders/user', isAuthenticated, async (req, res) => {
    try {
      let userId = (req.user as any)?.claims?.sub;
      
      // When auth is disabled, use test user ID
      if (process.env.AUTH_DISABLED === 'true') {
        userId = 'test-user-id';
      }
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Create test user for account testing
  app.post('/api/create-test-user', async (req, res) => {
    try {
      const { email, firstName, lastName, phone } = req.body;
      
      if (!email || !firstName) {
        return res.status(400).json({ error: 'Email and first name are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUser(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Create new test user
      const newUser = await storage.upsertUser({
        id: email,
        email,
        firstName,
        lastName: lastName || '',
        phone: phone || '',
      });

      res.json({ 
        message: 'Test user created successfully', 
        user: newUser 
      });
    } catch (error) {
      console.error('Error creating test user:', error);
      res.status(500).json({ error: 'Failed to create test user' });
    }
  });

  // Simple login for testing
  app.post('/api/test-login', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await storage.getUser(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Set user session (simplified for testing)
      (req.session as any).user = user;
      
      res.json({ 
        message: 'Login successful', 
        user 
      });
    } catch (error) {
      console.error('Error during test login:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Create test order for account testing
  app.post('/api/create-test-order', async (req, res) => {
    try {
      const { userEmail } = req.body;
      
      if (!userEmail) {
        return res.status(400).json({ error: 'User email is required' });
      }

      const user = await storage.getUser(userEmail);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get a sample product
      const products = await storage.getProducts();
      const sampleProduct = products[0];
      
      if (!sampleProduct) {
        return res.status(500).json({ error: 'No products available for test order' });
      }

      // Create test order
      const testOrder = await storage.createOrder({
        userId: user.id,
        orderType: 'installment',
        customerEmail: user.email || '',
        customerName: `${user.firstName} ${user.lastName}`.trim(),
        customerPhone: user.phone || '+234 123 456 7890',
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Lagos',
          state: 'Lagos'
        },
        nextOfKin: {
          name: 'Test Next of Kin',
          phone: '+234 987 654 3210'
        },
        bvn: '12345678901',
        nin: '12345678901234',
        items: [{
          productId: sampleProduct.id,
          name: sampleProduct.name,
          price: sampleProduct.price,
          quantity: 1,
          type: 'buy' as const,
          color: sampleProduct.colors[0] || 'Brown'
        }],
        subtotal: sampleProduct.price,
        vat: Math.round(sampleProduct.price * 0.075),
        insurance: 0,
        rentalFees: 0,
        deliveryFee: 15000,
        total: sampleProduct.price + Math.round(sampleProduct.price * 0.075) + 15000,
        paymentPlan: 6,
        monthlyPayment: Math.round((sampleProduct.price * 0.3) / 6),
        paymentStatus: 'pending'
      });

      res.json({ 
        message: 'Test order created successfully', 
        order: testOrder 
      });
    } catch (error) {
      console.error('Error creating test order:', error);
      res.status(500).json({ error: 'Failed to create test order' });
    }
  });

  // Pay remaining balance for an order
  app.post('/api/orders/:id/pay-remaining', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId !== userId) {
        return res.status(403).json({ error: 'Not authorized to access this order' });
      }

      // Update payment status to completed
      const updatedOrder = await storage.updateOrderPaymentStatus(orderId, 'completed');
      
      if (!updatedOrder) {
        return res.status(500).json({ error: 'Failed to update payment status' });
      }

      res.json({ 
        message: 'Payment successful', 
        order: updatedOrder 
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: 'Failed to process payment' });
    }
  });

  // Schedule subscription refresh
  app.post("/api/subscription/schedule-refresh", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
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

  // Admin API routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const orders = await storage.getOrdersByUser('all'); // Get all orders for admin
      
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      
      const stats = {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        activeSubscriptions: 0 // TODO: implement subscription counting
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser('all'); // Get all orders for admin
      res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    try {
      const settings = req.body;
      // TODO: Implement settings storage
      res.json({ message: "Settings updated successfully", settings });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Create subscription order
  app.post("/api/subscription/create", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
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
        monthlyPayment: planType === "basic" ? 15000 : planType === "premium" ? 25000 : 40000,
        seasonalRefreshEnabled: true,
        nextRefreshDate: new Date(Date.now() + (refreshFrequency === "quarterly" ? 90 : 180) * 24 * 60 * 60 * 1000)
      });

      res.json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for live chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients with their user info
  const clients = new Map<WebSocket, { userId?: string; userName?: string }>();
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    clients.set(ws, {});

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'message') {
          // Store user info
          const clientInfo = clients.get(ws) || {};
          clientInfo.userId = message.userId;
          clientInfo.userName = message.senderName;
          clients.set(ws, clientInfo);

          // Broadcast message to all connected clients
          const broadcastMessage = {
            type: 'message',
            id: message.id,
            text: message.text,
            sender: message.sender,
            timestamp: message.timestamp,
            senderName: message.senderName
          };

          // Echo back to sender for confirmation
          if (ws.readyState === WebSocket.OPEN) {
            // Auto-reply from support (simple bot responses)
            if (message.sender === 'user') {
              setTimeout(() => {
                const supportReply = generateSupportReply(message.text);
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    type: 'message',
                    id: Date.now().toString(),
                    text: supportReply,
                    sender: 'support',
                    timestamp: new Date().toISOString(),
                    senderName: 'Lumiere Support'
                  }));
                }
              }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
            }
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Support bot reply generator
  function generateSupportReply(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Thank you for contacting Lumiere Furniture. How can I help you today?";
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('payment')) {
      return "Our furniture comes with flexible payment options including monthly installments and rent-to-own plans. Would you like me to explain our payment plans?";
    }
    
    if (message.includes('delivery') || message.includes('shipping')) {
      return "We offer delivery across Nigeria. Delivery fees vary by state. Lagos delivery is ₦15,000, while other states range from ₦20,000-₦35,000. What's your location?";
    }
    
    if (message.includes('warranty') || message.includes('guarantee')) {
      return "All our furniture comes with a 2-year warranty. We also offer optional insurance for rental items at 2% of the item value. Would you like more details?";
    }
    
    if (message.includes('rent') || message.includes('rental')) {
      return "Our rent-to-own program allows you to enjoy furniture immediately with just 1% monthly rental fees. You can purchase anytime during the rental period. Which items interest you?";
    }
    
    if (message.includes('bvn') || message.includes('nin') || message.includes('verification')) {
      return "For security and Nigerian compliance, we require BVN and NIN verification for all purchases and rentals. This helps us serve you better and ensures secure transactions.";
    }
    
    if (message.includes('return') || message.includes('exchange')) {
      return "We have a 7-day return policy for purchases and flexible exchange options for rental items. Please check our Returns page for full details.";
    }
    
    if (message.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with regarding our furniture or services?";
    }
    
    // Default responses
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
