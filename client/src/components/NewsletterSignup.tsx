import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Mail, Sparkles, Gift, Bell } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignupProps {
  source?: string;
  variant?: 'popup' | 'inline' | 'footer';
  showPreferences?: boolean;
}

export default function NewsletterSignup({ 
  source = 'website', 
  variant = 'inline', 
  showPreferences = true 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    seasonalUpdates: true,
    promotions: true,
    newArrivals: true
  });
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; source: string; preferences: any }) => {
      return apiRequest("POST", "/api/newsletter/signup", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Lumier!",
        description: "You've successfully subscribed to our newsletter.",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    signupMutation.mutate({
      email,
      source,
      preferences: showPreferences ? preferences : {
        seasonalUpdates: true,
        promotions: true,
        newArrivals: true
      }
    });
  };

  const updatePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (variant === 'popup') {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-2 border-lumier-gold">
        <CardHeader className="text-center bg-gradient-to-r from-lumier-gold to-yellow-400 text-white">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            Exclusive Offers Await!
          </CardTitle>
          <p className="text-sm opacity-90">
            Get 15% off your first subscription + early access to seasonal collections
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-center"
            />
            
            <Button 
              type="submit" 
              className="w-full bg-lumier-gold hover:bg-lumier-gold/90 text-lumier-black"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Subscribing..." : "Claim Your Offer"}
            </Button>
            
            <p className="text-xs text-center text-lumier-gray">
              No spam, unsubscribe anytime. View our Privacy Policy.
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stay in the Loop</h3>
        <p className="text-sm text-lumier-gray">
          Get notified about new collections, seasonal refreshes, and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button 
            type="submit"
            disabled={signupMutation.isPending}
            className="bg-lumier-gold hover:bg-lumier-gold/90 text-lumier-black"
          >
            {signupMutation.isPending ? "..." : "Subscribe"}
          </Button>
        </form>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Newsletter Subscription
        </CardTitle>
        <p className="text-sm text-lumier-gray">
          Stay updated with seasonal collections, exclusive offers, and furniture trends.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          {showPreferences && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Email Preferences:</p>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox 
                    checked={preferences.seasonalUpdates}
                    onCheckedChange={() => updatePreference('seasonalUpdates')}
                  />
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Seasonal Updates & Collections</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox 
                    checked={preferences.promotions}
                    onCheckedChange={() => updatePreference('promotions')}
                  />
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-lumier-gold" />
                    <span className="text-sm">Exclusive Promotions & Discounts</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox 
                    checked={preferences.newArrivals}
                    onCheckedChange={() => updatePreference('newArrivals')}
                  />
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">New Arrivals & Product Launches</span>
                  </div>
                </label>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-lumier-gold hover:bg-lumier-gold/90 text-lumier-black"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Subscribing..." : "Subscribe to Newsletter"}
          </Button>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="text-xs">
              <Bell className="h-3 w-3 mr-1" />
              Seasonal Alerts
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Gift className="h-3 w-3 mr-1" />
              Exclusive Offers
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Early Access
            </Badge>
          </div>
          
          <p className="text-xs text-center text-lumier-gray">
            We respect your privacy. Unsubscribe anytime with one click.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}