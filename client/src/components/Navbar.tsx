import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LiveChat from "@/components/LiveChat";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const cartItemsCount = useMemo(() => 
    cart.reduce((total, item) => total + item.quantity, 0), 
    [cart]
  );

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Subscription", href: "/subscription" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src="/assets/LUMIERE LOGO_PSD_1750194691932.png" 
                  alt="Lumiere Furniture - RC 3662809" 
                  className="h-16 w-auto mix-blend-multiply object-cover object-center"
                  style={{ 
                    transform: 'scale(2)', 
                    transformOrigin: 'center',
                    clipPath: 'inset(25% 0 25% 0)'
                  }}
                />
              </div>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span className={`text-lumiere-gray hover:text-lumiere-gold transition-colors cursor-pointer ${
                    location === item.href ? 'text-lumiere-gold' : ''
                  }`}>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <div className="relative cursor-pointer">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-lumiere-gold text-lumiere-black text-xs">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </Link>
            {/* Authentication */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/account" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.reload();
                    } catch (error) {
                      console.error('Logout failed:', error);
                    }
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/test-auth">
                <Button 
                  className="bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90"
                >
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Live Chat Button */}
            <LiveChat />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`block px-3 py-2 text-lumiere-gray hover:text-lumiere-gold transition-colors cursor-pointer ${
                      location === item.href ? 'text-lumiere-gold' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
