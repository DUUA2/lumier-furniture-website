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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: false,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: false,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: false,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: false,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: true,
    availableForInstallment: true
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
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
  },
  {
    name: 'Elegant Side Table',
    description: 'Perfect complement to sofas and chairs',
    price: 18000,
    category: 'Living Room',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    colors: ['#92400E', '#1F2937'],
    dimensions: '50cm x 40cm x 55cm',
    material: 'Wood',
    weight: '8kg',
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
  }
];

async function seedDatabase() {
  try {
    console.log('Clearing existing products...');
    await db.delete(products);
    
    console.log('Seeding products...');
    await db.insert(products).values(sampleProducts);
    
    console.log('✅ Database seeded successfully with', sampleProducts.length, 'products');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run seeding if this file is executed directly
seedDatabase().then(() => process.exit(0));
