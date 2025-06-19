import { Button } from "@/components/ui/button";
import { CreditCard, Truck, Award } from "lucide-react";

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-lumiere-black text-white">
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
              <span className="text-lumiere-gold">Rent or Own</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Transform your space with premium furniture. Flexible payment plans designed for the modern Nigerian lifestyle.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90"
                onClick={() => window.location.href = "/api/login"}
              >
                Sign In to Shop
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-lumiere-black"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-lumiere-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-lumiere-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Payment Options</h3>
            <p className="text-lumiere-gray">Buy outright or choose 2-6 month installment plans with transparent pricing</p>
          </div>
          <div className="text-center">
            <div className="bg-lumiere-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-lumiere-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reliable Delivery</h3>
            <p className="text-lumiere-gray">Professional delivery service across major Nigerian cities</p>
          </div>
          <div className="text-center">
            <div className="bg-lumiere-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-lumiere-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-lumiere-gray">Handpicked luxury furniture from trusted brands</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-lumiere-gray mb-8 text-lg">
            Join thousands of satisfied customers who have furnished their homes with Lumiere
          </p>
          <Button 
            size="lg" 
            className="bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}