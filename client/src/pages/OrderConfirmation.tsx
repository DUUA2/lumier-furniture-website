import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency, calculateVAT, calculateMonthlyPayment } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderData {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bvn: string;
    nin: string;
  };
  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
  };
  paymentPlan: {
    type: string;
    months?: number;
    insurance?: boolean;
  };
  deliveryFee: number;
}

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { cart, getCartTotal, clearCart } = useCart();

  // Get order data from localStorage (passed from checkout)
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const savedOrderData = localStorage.getItem('pendingOrder');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    } else {
      // Redirect back to checkout if no order data
      setLocation('/checkout');
    }
  }, [setLocation]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const subtotal = getCartTotal();
  const vat = calculateVAT(subtotal);
  const total = subtotal + vat + orderData.deliveryFee;

  const getPaymentDetails = () => {
    if (orderData.paymentPlan.type === 'rent') {
      const monthlyRental = subtotal * 0.01; // 1% monthly
      const insuranceFee = orderData.paymentPlan.insurance ? subtotal * 0.02 : 0;
      return {
        type: 'Rent-to-Own',
        monthlyAmount: monthlyRental + insuranceFee,
        description: `${formatCurrency(monthlyRental)}/month ${orderData.paymentPlan.insurance ? `+ ${formatCurrency(insuranceFee)} insurance` : ''}`
      };
    } else if (orderData.paymentPlan.type === 'installment') {
      const months = orderData.paymentPlan.months || 3;
      const monthlyPayment = calculateMonthlyPayment(total, months);
      return {
        type: `${months}-Month Installment`,
        monthlyAmount: monthlyPayment,
        description: `${formatCurrency(monthlyPayment)}/month for ${months} months (5% service fee included)`
      };
    } else {
      return {
        type: 'Full Payment',
        monthlyAmount: total,
        description: 'One-time payment'
      };
    }
  };

  const paymentDetails = getPaymentDetails();

  const handleConfirmOrder = async () => {
    if (!confirmed) return;
    
    setIsProcessing(true);

    try {
      // Create the order
      const orderPayload = {
        customerEmail: orderData.customerInfo.email,
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        customerPhone: orderData.customerInfo.phone,
        bvn: orderData.customerInfo.bvn,
        nin: orderData.customerInfo.nin,
        deliveryAddress: `${orderData.deliveryAddress.address}, ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} ${orderData.deliveryAddress.zipCode}`,
        nextOfKinName: orderData.nextOfKin.name,
        nextOfKinRelationship: orderData.nextOfKin.relationship,
        nextOfKinPhone: orderData.nextOfKin.phone,
        items: cart,
        subtotal,
        vat,
        deliveryFee: orderData.deliveryFee,
        total,
        paymentType: orderData.paymentPlan.type,
        paymentMonths: orderData.paymentPlan.months,
        insurance: orderData.paymentPlan.insurance,
        monthlyAmount: paymentDetails.monthlyAmount
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      
      // Clear cart and order data
      clearCart();
      localStorage.removeItem('pendingOrder');
      
      // Redirect to thank you page with order details
      setLocation(`/thankyou?orderId=${order.id}&total=${total}&plan=${orderData.paymentPlan.months || 12}&monthly=${paymentDetails.monthlyAmount}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditOrder = () => {
    setLocation('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lumier-black mb-2">Order Confirmation</h1>
          <p className="text-lumier-gray">Please review your order details before confirming</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</p>
                  <p className="text-sm text-lumier-gray">{orderData.customerInfo.email}</p>
                  <p className="text-sm text-lumier-gray">{orderData.customerInfo.phone}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm"><strong>BVN:</strong> ****{orderData.customerInfo.bvn.slice(-4)}</p>
                  <p className="text-sm"><strong>NIN:</strong> ****{orderData.customerInfo.nin.slice(-4)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>{orderData.deliveryAddress.address}</p>
                  <p>{orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} {orderData.deliveryAddress.zipCode}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next of Kin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{orderData.nextOfKin.name}</p>
                  <p className="text-lumier-gray">Relationship: {orderData.nextOfKin.relationship}</p>
                  <p className="text-lumier-gray">Phone: {orderData.nextOfKin.phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-lumier-gray">
                          Color: {item.color} | Type: {item.type === 'buy' ? 'Purchase' : 'Rental'}
                        </p>
                        <p className="text-sm text-lumier-gray">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Type:</span>
                    <span className="font-medium">{paymentDetails.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span className="font-medium">{paymentDetails.description}</span>
                  </div>
                  {orderData.paymentPlan.insurance && (
                    <p className="text-sm text-lumier-gray mt-2">
                      ✓ Insurance included (damage protection & maintenance)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%):</span>
                    <span>{formatCurrency(vat)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>{formatCurrency(orderData.deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Section */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="confirm" 
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked === true)}
                />
                <label htmlFor="confirm" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I confirm that all the above details are correct and I agree to the{" "}
                  <a href="/terms" target="_blank" className="text-lumier-gold hover:underline">
                    terms and conditions
                  </a>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleEditOrder}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Edit Order
                </Button>
                <Button
                  onClick={handleConfirmOrder}
                  disabled={!confirmed || isProcessing}
                  className="flex-1 bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90"
                >
                  {isProcessing ? "Processing..." : "Confirm & Pay"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}