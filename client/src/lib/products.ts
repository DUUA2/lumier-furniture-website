import { Product } from "@shared/schema";

export const getMonthlyPrice = (price: number, months: number = 12): number => {
  return Math.round(price / months);
};

export const getRentalPrice = (price: number, rentalRate: number = 0.15): number => {
  return Math.round(price * rentalRate);
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

export const getProductsByCategory = (products: Product[], category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const searchProducts = (products: Product[], query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'category':
      return sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return sortedProducts;
  }
};

export const filterProductsByPriceRange = (
  products: Product[], 
  minPrice: number, 
  maxPrice: number
): Product[] => {
  return products.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
};
