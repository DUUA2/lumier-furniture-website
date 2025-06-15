import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface OrderData {
  id: number;
  total: number;
  plan: number;
  monthly: number;
}

export default function ThankYou() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      setOrderData(JSON.parse(lastOrder));
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-lumier-gray mb-6">
          Your order has been successfully placed. You will receive a confirmation email shortly.
        </p>
        
        {orderData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Number:</span>
                <span className="font-medium">#LF-2024-{orderData.id.toString().padStart(3, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">₦{orderData.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Plan:</span>
                <span className="font-medium">{orderData.plan} Month{orderData.plan > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Payment:</span>
                <span className="font-medium">₦{orderData.monthly.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Link href="/explore">
            <Button className="w-full bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
