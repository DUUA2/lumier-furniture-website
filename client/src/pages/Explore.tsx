import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Explore() {
  const [location] = useLocation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");

  // Check for category parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [location]);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products
    .filter(product => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      
      if (priceRange) {
        switch (priceRange) {
          case "under-50k":
            return product.price < 50000;
          case "50k-100k":
            return product.price >= 50000 && product.price <= 100000;
          case "above-100k":
            return product.price > 100000;
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

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="under-50k"
                      name="price"
                      value="under-50k"
                      checked={priceRange === "under-50k"}
                      onChange={(e) => setPriceRange(e.target.value)}
                    />
                    <Label htmlFor="under-50k" className="text-sm">
                      Under ₦50,000
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="50k-100k"
                      name="price"
                      value="50k-100k"
                      checked={priceRange === "50k-100k"}
                      onChange={(e) => setPriceRange(e.target.value)}
                    />
                    <Label htmlFor="50k-100k" className="text-sm">
                      ₦50,000 - ₦100,000
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="above-100k"
                      name="price"
                      value="above-100k"
                      checked={priceRange === "above-100k"}
                      onChange={(e) => setPriceRange(e.target.value)}
                    />
                    <Label htmlFor="above-100k" className="text-sm">
                      Above ₦100,000
                    </Label>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange("");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Explore Furniture</h1>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-lumier-gray mb-2">No products found</h3>
              <p className="text-lumier-gray mb-6">Try adjusting your filters</p>
              <Button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange("");
                }}
                className="bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
