import { db } from "./db";
import { products } from "@shared/schema";

const sampleProducts = [
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
  },
  {
    name: 'Executive Office Desk',
    description: 'Large desk with built-in storage',
    price: 78000,
    category: 'Office',
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#92400E', '#1F2937'],
    dimensions: '150cm x 70cm x 75cm',
    material: 'Engineered Wood',
    weight: '40kg',
    inStock: true
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Adjustable height with lumbar support',
    price: 35000,
    category: 'Office',
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#1F2937', '#6B7280'],
    dimensions: '60cm x 60cm x 100-110cm',
    material: 'Mesh and Plastic',
    weight: '15kg',
    inStock: true
  },
  {
    name: 'Table Lamp Set',
    description: 'Modern LED table lamps (set of 2)',
    price: 18000,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#F4C430', '#1F2937', '#6B7280'],
    dimensions: '25cm x 25cm x 40cm',
    material: 'Metal and Fabric',
    weight: '2kg (each)',
    inStock: true
  },
  {
    name: 'Ceiling Light Fixture',
    description: 'Modern pendant light with dimmer',
    price: 32000,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#F4C430', '#1F2937'],
    dimensions: '40cm x 40cm x 30cm',
    material: 'Metal and Glass',
    weight: '3kg',
    inStock: true
  },
  {
    name: 'Wall Art Collection',
    description: 'Set of 4 framed abstract prints',
    price: 22000,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#F4C430', '#1F2937', '#92400E'],
    dimensions: '30cm x 40cm (each)',
    material: 'Canvas and Frame',
    weight: '1kg (each)',
    inStock: true
  },
  {
    name: 'Decorative Vase Set',
    description: 'Ceramic vases in different sizes',
    price: 12000,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#6B7280', '#92400E', '#F4C430'],
    dimensions: '15-25cm height',
    material: 'Ceramic',
    weight: '1.5kg (set)',
    inStock: true
  },
  {
    name: 'Bookshelf Unit',
    description: '5-tier open bookshelf',
    price: 38000,
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#92400E', '#1F2937'],
    dimensions: '80cm x 30cm x 180cm',
    material: 'Engineered Wood',
    weight: '25kg',
    inStock: true
  },
  {
    name: 'Storage Cabinet',
    description: '3-door cabinet with shelves',
    price: 55000,
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#92400E', '#1F2937', '#6B7280'],
    dimensions: '120cm x 40cm x 90cm',
    material: 'Solid Wood',
    weight: '35kg',
    inStock: true
  },
  {
    name: 'File Cabinet',
    description: '4-drawer filing cabinet with lock',
    price: 28000,
    category: 'Office',
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#1F2937', '#6B7280'],
    dimensions: '40cm x 60cm x 130cm',
    material: 'Metal',
    weight: '20kg',
    inStock: true
  }
];

async function seedDatabase() {
  try {
    console.log('Seeding database with sample products...');
    
    // Check if products already exist
    const existingProducts = await db.select().from(products);
    if (existingProducts.length > 0) {
      console.log('Products already exist in database, skipping seed.');
      return;
    }

    // Insert all products
    await db.insert(products).values(sampleProducts);
    
    console.log(`Successfully seeded ${sampleProducts.length} products to the database.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();