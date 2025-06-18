import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Truck, Shield, Recycle, Palette } from "lucide-react";
import { Link } from "wouter";

const subscriptionTiers = [
  {
    id: "starter",
    name: "Starter Living",
    price: 25000,
    description: "Perfect for studio apartments or single rooms",
    items: "2-3 pieces",
    swapFrequency: "Every 6 months",
    popular: false,
    features: [
      "2-3 furniture pieces",
      "Free delivery & pickup",
      "Swap items every 6 months", 
      "Basic maintenance included",
      "24/7 customer support"
    ],
    itemTypes: ["Sofa or chair", "Coffee table", "Side table or lamp"]
  },
  {
    id: "comfort",
    name: "Comfort Plus",
    price: 45000,
    description: "Ideal for 1-2 bedroom apartments",
    items: "4-6 pieces",
    swapFrequency: "Every 4 months",
    popular: true,
    features: [
      "4-6 furniture pieces",
      "Free delivery & pickup",
      "Swap items every 4 months",
      "Priority maintenance",
      "Optional insurance (₦2,000/month)",
      "Style consultation included",
      "24/7 customer support"
    ],
    itemTypes: ["Living room set", "Dining table & chairs", "Bedroom furniture", "Storage solutions"]
  },
  {
    id: "luxury",
    name: "Luxury Collection",
    price: 75000,
    description: "Premium experience for larger homes",
    items: "8-12 pieces",
    swapFrequency: "Every 3 months",
    popular: false,
    features: [
      "8-12 premium furniture pieces",
      "White-glove delivery service",
      "Swap items every 3 months",
      "Concierge maintenance",
      "Complimentary insurance included",
      "Personal interior designer",
      "First access to new collections",
      "Eco-friendly premium materials",
      "24/7 priority support"
    ],
    itemTypes: ["Complete living room", "Full dining set", "Master bedroom suite", "Home office setup", "Accent pieces & decor"]
  }
];

export default function Subscription() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lumier-cream to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-lumier-black to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Furniture <span className="text-lumier-gold">Subscription</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your living space with flexible furniture subscriptions. 
            Enjoy premium pieces, regular refreshes, and sustainable living.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-lumier-gold" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-lumier-gold" />
              <span>Maintenance Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-lumier-gold" />
              <span>Eco-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-lumier-gold" />
              <span>Regular Swaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Choose Your Subscription Plan</h2>
          <p className="text-lg text-lumier-gray max-w-2xl mx-auto leading-relaxed">
            Flexible furniture subscriptions designed for every lifestyle and space
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {subscriptionTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                tier.popular ? 'ring-2 ring-lumier-gold shadow-lg scale-105' : 'hover:scale-105'
              } ${selectedTier === tier.id ? 'ring-2 ring-lumier-gold' : ''}`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-lumier-gold text-lumier-black px-3 py-1 rounded-bl-lg">
                  <Star className="h-4 w-4 inline mr-1" />
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
                <div className="py-4">
                  <span className="text-4xl font-bold">₦{tier.price.toLocaleString()}</span>
                  <span className="text-lumier-gray">/month</span>
                </div>
                <div className="flex justify-center gap-4 text-sm text-lumier-gray">
                  <span>{tier.items}</span>
                  <span>•</span>
                  <span>{tier.swapFrequency}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {tier.itemTypes.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-5 w-5 text-lumier-gold mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-5 w-5 text-lumier-gold mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className={`w-full ${
                    tier.popular 
                      ? 'bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90' 
                      : 'bg-lumier-black text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {selectedTier === tier.id ? 'Selected' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sustainability Section */}
        <div className="bg-green-50 rounded-xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 text-green-800">
              <Recycle className="h-8 w-8 inline mr-2" />
              Sustainable Living
            </h3>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Our subscription model promotes environmental responsibility through circular furniture economy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2 text-green-800">Reduce Waste</h4>
              <p className="text-sm text-green-600">
                Furniture gets reused across multiple customers, reducing landfill waste
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2 text-green-800">Local Artisans</h4>
              <p className="text-sm text-green-600">
                Supporting Nigerian craftsmen using sustainable, eco-friendly materials
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2 text-green-800">Quality Care</h4>
              <p className="text-sm text-green-600">
                Professional maintenance extends furniture life and maintains quality
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-8">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-lumier-gold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lumier-black font-bold text-lg">
                1
              </div>
              <h4 className="font-semibold mb-2">Choose Your Plan</h4>
              <p className="text-sm text-lumier-gray">
                Select the subscription tier that fits your space and lifestyle
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-lumier-gold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lumier-black font-bold text-lg">
                2
              </div>
              <h4 className="font-semibold mb-2">Customize & Preview</h4>
              <p className="text-sm text-lumier-gray">
                Use our AR tool to visualize furniture in your space
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-lumier-gold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lumier-black font-bold text-lg">
                3
              </div>
              <h4 className="font-semibold mb-2">Enjoy & Swap</h4>
              <p className="text-sm text-lumier-gray">
                Live with your furniture and swap pieces when you're ready for change
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-lumier-gold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lumier-black font-bold text-lg">
                4
              </div>
              <h4 className="font-semibold mb-2">Seamless Service</h4>
              <p className="text-sm text-lumier-gray">
                We handle delivery, maintenance, and pickup - you just enjoy beautiful furniture
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="bg-lumier-cream rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Subscriptions?</h3>
          <p className="text-lumier-gray mb-6">
            Learn about swapping, maintenance, cancellations, and more
          </p>
          <Link href="/help">
            <Button variant="outline" className="border-lumier-gold text-lumier-gold hover:bg-lumier-gold hover:text-lumier-black">
              View Subscription FAQ
            </Button>
          </Link>
        </div>

        {/* CTA Section */}
        {selectedTier && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h4 className="font-semibold">
                  {subscriptionTiers.find(t => t.id === selectedTier)?.name}
                </h4>
                <p className="text-sm text-lumier-gray">
                  ₦{subscriptionTiers.find(t => t.id === selectedTier)?.price.toLocaleString()}/month
                </p>
              </div>
              <Link href="/checkout">
                <Button className="bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}