import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { PAYMENT_CONFIG } from "./config";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

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
                    senderName: 'Lumier Support'
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
      return "Hello! Thank you for contacting Lumier Furniture. How can I help you today?";
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
