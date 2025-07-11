import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Category from "@/pages/Category";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Subscription from "@/pages/Subscription";
import ThankYou from "@/pages/ThankYou";
import Terms from "@/pages/Terms";
import HelpCenter from "@/pages/HelpCenter";
import Returns from "@/pages/Returns";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import SimpleAdmin from "@/pages/SimpleAdmin";
import DeploymentGuide from "@/pages/DeploymentGuide";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Account from "@/pages/Account";
import TestLogin from "@/pages/TestLogin";
import QuickTest from "@/pages/QuickTest";
import TestAuth from "@/pages/TestAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/category/:category" component={Category} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/confirm-order" component={OrderConfirmation} />
      <Route path="/profile" component={Profile} />
      <Route path="/account" component={Account} />
      <Route path="/test-login" component={TestLogin} />
      <Route path="/test-auth" component={TestAuth} />
      <Route path="/quick-test" component={QuickTest} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/manage" component={SimpleAdmin} />
      <Route path="/deployment-guide" component={DeploymentGuide} />
      <Route path="/terms" component={Terms} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/returns" component={Returns} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/thankyou" component={ThankYou} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
