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
      const totalMonthly = monthlyRental + insuranceFee;
      return {
        type: 'Rent-to-Own',
        monthlyAmount: totalMonthly,
        description: `${formatCurrency(totalMonthly)}/month`,
        breakdown: {
          rental: monthlyRental,
          insurance: insuranceFee,
          totalPaid: 0, // First month
          remainingBalance: total // Full amount until ownership transfer
        }
      };
    } else if (orderData.paymentPlan.type === 'installment') {
      const months = orderData.paymentPlan.months || 3;
      const serviceRate = 0.05; // 5% service fee
      const baseAmount = total;
      const serviceFee = baseAmount * serviceRate;
      const totalWithFees = baseAmount + serviceFee;
      const monthlyPayment = totalWithFees / months;
      
      return {
        type: `${months}-Month Installment Plan`,
        monthlyAmount: monthlyPayment,
        description: `${formatCurrency(monthlyPayment)}/month for ${months} months`,
        breakdown: {
          baseAmount: baseAmount,
          serviceFee: serviceFee,
          totalWithFees: totalWithFees,
          monthlyPayment: monthlyPayment,
          totalPaid: 0, // First payment
          remainingBalance: totalWithFees,
          months: months
        }
      };
    } else {
      return {
        type: 'Full Payment',
        monthlyAmount: total,
        description: 'One-time payment',
        breakdown: {
          totalPaid: total,
          remainingBalance: 0
        }
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
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-lumiere-black mb-2">Order Confirmation</h1>
          <p className="text-lumiere-gray text-sm sm:text-base">Please review your order details before confirming</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</p>
                  <p className="text-sm text-lumiere-gray">{orderData.customerInfo.email}</p>
                  <p className="text-sm text-lumiere-gray">{orderData.customerInfo.phone}</p>
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
                  <p className="text-lumiere-gray">Relationship: {orderData.nextOfKin.relationship}</p>
                  <p className="text-lumiere-gray">Phone: {orderData.nextOfKin.phone}</p>
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
                        <p className="text-sm text-lumiere-gray">
                          Color: {item.color} | Type: {item.type === 'buy' ? 'Purchase' : 'Rental'}
                        </p>
                        <p className="text-sm text-lumiere-gray">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
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
                  <a href="/terms" target="_blank" className="text-lumiere-gold hover:underline">
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
                  className="flex-1 bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90"
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