import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import { CreditCard, Truck, Award } from "lucide-react";

export default function Home() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-lumier-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
              Luxury Furniture<br />
              <span className="text-lumier-gold">Rent or Own</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Transform your space with premium furniture. Flexible payment plans designed for the modern Nigerian lifestyle.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/explore">
                <Button size="lg" className="bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90">
                  Explore Collection
                </Button>
              </Link>
              <Button size="lg" className="bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Living Room Furniture"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Living Room</h3>
              <p className="text-lumier-gray mb-4">Comfortable sofas, coffee tables, and entertainment units</p>
              <Link href="/explore">
                <Button variant="link" className="text-lumier-gold p-0 hover:underline">
                  Shop Now →
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Bedroom Furniture"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Bedroom</h3>
              <p className="text-lumier-gray mb-4">Premium beds, wardrobes, and bedside furniture</p>
              <Link href="/explore">
                <Button variant="link" className="text-lumier-gold p-0 hover:underline">
                  Shop Now →
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Dining Room Furniture"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Dining Room</h3>
              <p className="text-lumier-gray mb-4">Elegant dining sets and storage solutions</p>
              <Link href="/explore">
                <Button variant="link" className="text-lumier-gold p-0 hover:underline">
                  Shop Now →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Lumier */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Lumier?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-lumier-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Flexible Payment Options</h3>
            <p className="text-lumier-gray">Buy outright or choose 2-6 month installment plans with transparent pricing</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-lumier-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Reliable Delivery</h3>
            <p className="text-lumier-gray">Professional delivery service across major Nigerian cities with tracking</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-lumier-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
            <p className="text-lumier-gray">Carefully selected furniture from trusted manufacturers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
