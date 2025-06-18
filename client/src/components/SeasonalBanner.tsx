import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface SeasonalCollection {
  id: number;
  name: string;
  description: string;
  season: string;
  bannerText: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

interface SeasonalBannerProps {
  position?: 'top' | 'inline';
  dismissible?: boolean;
}

export default function SeasonalBanner({ position = 'top', dismissible = true }: SeasonalBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: activeCollection } = useQuery<SeasonalCollection>({
    queryKey: ["/api/seasonal-collections/active"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check if banner was previously dismissed
  useEffect(() => {
    if (activeCollection && dismissible) {
      const dismissed = localStorage.getItem(`banner-dismissed-${activeCollection.id}`);
      setIsDismissed(!!dismissed);
    }
  }, [activeCollection, dismissible]);

  const handleDismiss = () => {
    if (activeCollection) {
      localStorage.setItem(`banner-dismissed-${activeCollection.id}`, 'true');
      setIsDismissed(true);
    }
  };

  const getSeasonalColors = (season: string) => {
    switch (season.toLowerCase()) {
      case 'spring':
        return 'from-green-500 to-emerald-400';
      case 'summer':
        return 'from-yellow-500 to-orange-400';
      case 'fall':
      case 'autumn':
        return 'from-orange-500 to-red-400';
      case 'winter':
        return 'from-blue-500 to-indigo-400';
      default:
        return 'from-lumier-gold to-yellow-400';
    }
  };

  const getTimeRemaining = () => {
    if (!activeCollection?.endDate) return null;
    
    const now = new Date().getTime();
    const endTime = new Date(activeCollection.endDate).getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return null;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days left`;
    if (hours > 0) return `${hours} hours left`;
    return 'Ending soon';
  };

  if (!activeCollection || isDismissed) return null;

  const timeRemaining = getTimeRemaining();
  const gradientClass = getSeasonalColors(activeCollection.season);

  if (position === 'top') {
    return (
      <div className={`bg-gradient-to-r ${gradientClass} text-white relative`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Sparkles className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">
                  {activeCollection.bannerText || `${activeCollection.name} - Limited Time!`}
                </p>
                {timeRemaining && (
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {timeRemaining}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href="/subscription">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              
              {dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant for homepage/product pages
  return (
    <div className={`bg-gradient-to-r ${gradientClass} text-white rounded-xl p-6 mb-8 relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {activeCollection.season.charAt(0).toUpperCase() + activeCollection.season.slice(1)} Collection
            </Badge>
            {timeRemaining && (
              <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                <Clock className="h-3 w-3 mr-1" />
                {timeRemaining}
              </Badge>
            )}
          </div>
          
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{activeCollection.name}</h3>
        {activeCollection.description && (
          <p className="text-white/90 mb-4 max-w-2xl">{activeCollection.description}</p>
        )}
        
        <div className="flex flex-wrap gap-3">
          <Link href="/subscription">
            <Button 
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-white/90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Browse Collection
            </Button>
          </Link>
          
          <Link href="/explore">
            <Button 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    </div>
  );
}