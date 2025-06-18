import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import SeasonalBanner from "@/components/SeasonalBanner";
import NewsletterSignup from "@/components/NewsletterSignup";
import { CreditCard, Truck, Award, Recycle, Leaf, Users } from "lucide-react";

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
              <Link href="/terms">
                <Button size="lg" className="bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/category/Living%20Room" className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Living Room Furniture"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Living Room</h3>
                <p className="text-lumier-gray text-sm mb-3">Sofas, chairs, and entertainment units</p>
                <span className="text-lumier-gold text-sm font-medium">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
          
          <Link href="/category/Bedroom" className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Bedroom Furniture"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Bedroom</h3>
                <p className="text-lumier-gray text-sm mb-3">Beds, wardrobes, and bedside furniture</p>
                <span className="text-lumier-gold text-sm font-medium">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
          
          <Link href="/category/Dining%20Room" className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Dining Room Furniture"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Dining Room</h3>
                <p className="text-lumier-gray text-sm mb-3">Dining sets and bar stools</p>
                <span className="text-lumier-gold text-sm font-medium">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/category/Office" className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Office Furniture"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Office</h3>
                <p className="text-lumier-gray text-sm mb-3">Desks, chairs, and storage solutions</p>
                <span className="text-lumier-gold text-sm font-medium">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/category/Lighting" className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Lighting"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Lighting</h3>
                <p className="text-lumier-gray text-sm mb-3">Floor lamps, table lamps, and fixtures</p>
                <span className="text-lumier-gold text-sm font-medium">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/category/Decor" className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Decor"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Decor</h3>
                <p className="text-lumier-gray text-sm mb-3">Mirrors, artwork, and accessories</p>
                <span className="text-lumier-gold text-sm font-medium">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/category/Storage" className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Storage"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Storage</h3>
                <p className="text-lumier-gray text-sm mb-3">Bookcases, cabinets, and organizers</p>
                <span className="text-lumier-gold text-sm font-medium">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/explore" className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="All Categories"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">View All</h3>
                <p className="text-lumier-gray text-sm mb-3">Browse our complete furniture collection</p>
                <span className="text-lumier-gold text-sm font-medium">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
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

      {/* Sustainability Section */}
      <div className="bg-gradient-to-r from-green-50 to-lumier-cream py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sustainable Living</h2>
            <p className="text-lg text-lumier-gray max-w-3xl mx-auto">
              Our subscription model promotes environmental responsibility through circular furniture economy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Circular Economy</h3>
              <p className="text-lumier-gray">Furniture gets reused across multiple customers, reducing waste and promoting sustainability</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Eco-Friendly Materials</h3>
              <p className="text-lumier-gray">Supporting local artisans using sustainable, environmentally conscious materials</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
              <p className="text-lumier-gray">Creating jobs and supporting Nigerian craftsmen while reducing furniture waste</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/subscription">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Explore Subscription Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
