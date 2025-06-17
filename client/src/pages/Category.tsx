import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Category() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.category || "");
  const [sortBy, setSortBy] = useState<string>("name");
  const [priceRange, setPriceRange] = useState<string>("");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categoryProducts = products.filter(product => 
    product.category.toLowerCase() === categoryName.toLowerCase()
  );

  const filteredAndSortedProducts = categoryProducts
    .filter(product => {
      if (priceRange && priceRange !== "all") {
        switch (priceRange) {
          case "under-50k":
            return product.price < 50000;
          case "50k-100k":
            return product.price >= 50000 && product.price <= 100000;
          case "100k-200k":
            return product.price >= 100000 && product.price <= 200000;
          case "above-200k":
            return product.price > 200000;
          default:
            return true;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categoryDescriptions: Record<string, string> = {
    "living room": "Transform your living space with our premium sofas, chairs, coffee tables, and entertainment units designed for comfort and style.",
    "bedroom": "Create your perfect sanctuary with our luxury beds, wardrobes, dressers, and bedside furniture crafted for relaxation.",
    "dining room": "Elevate your dining experience with our elegant dining sets, chairs, and bar stools perfect for entertaining.",
    "office": "Boost productivity with our professional office desks, ergonomic chairs, and storage solutions.",
    "lighting": "Illuminate your space with our contemporary floor lamps, table lamps, and decorative lighting fixtures.",
    "decor": "Add the finishing touches with our curated selection of mirrors, artwork, and decorative accessories."
  };

  const categoryDescription = categoryDescriptions[categoryName.toLowerCase()] || 
    `Discover our premium ${categoryName.toLowerCase()} furniture collection.`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
        <p className="text-lumier-gray text-lg max-w-3xl">{categoryDescription}</p>
        <div className="mt-4 text-sm text-lumier-gray">
          {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Sort by</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="All prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All prices</SelectItem>
              <SelectItem value="under-50k">Under ₦50,000</SelectItem>
              <SelectItem value="50k-100k">₦50,000 - ₦100,000</SelectItem>
              <SelectItem value="100k-200k">₦100,000 - ₦200,000</SelectItem>
              <SelectItem value="above-200k">Above ₦200,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button 
            variant="outline" 
            onClick={() => {
              setSortBy("name");
              setPriceRange("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-lumier-gray mb-6">
            {priceRange || sortBy !== "name" 
              ? "Try adjusting your filters to see more products."
              : `We don't have any ${categoryName.toLowerCase()} products available right now.`
            }
          </p>
          <Link href="/explore">
            <Button className="bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90">
              Browse All Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}