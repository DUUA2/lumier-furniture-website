import { Router } from "express";
import { db } from "./db";
import { products } from "../shared/schema";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.select().from(products);
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
