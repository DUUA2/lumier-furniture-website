import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { calculatePaymentBreakdown, formatCurrency } from "@/lib/paymentUtils";
import { ShoppingCart, User, MapPin, CreditCard, Check } from "lucide-react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bvn: string;
    nin: string;
    nextOfKinName: string;
    nextOfKinRelationship: string;
    nextOfKinPhone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    purchaseType: string;
    paymentPlan: string;
    subscriptionPlan: string;
    insurance: boolean;
    agreeToTerms: boolean;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bvn: "",
    nin: "",
    nextOfKinName: "",
    nextOfKinRelationship: "",
    nextOfKinPhone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    purchaseType: "full",
    paymentPlan: "2",
    subscriptionPlan: "basic",
    insurance: false,
    agreeToTerms: false,
  });

  // Auto-fill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: (user as any)?.firstName || "",
        lastName: (user as any)?.lastName || "",
        email: (user as any)?.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPaymentBreakdown = () => {
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const installmentMonths = formData.purchaseType === 'full' ? 0 : parseInt(formData.paymentPlan) || 0;
    
    return calculatePaymentBreakdown(
      cartTotal,
      installmentMonths,
      formData.insurance,
      5000 // delivery fee
    );
  };

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Order failed');
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      toast({
        title: "Order Submitted!",
        description: "Your order has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    const breakdown = getPaymentBreakdown();
    
    const orderData = {
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bvn: formData.bvn,
        nin: formData.nin,
      },
      nextOfKin: {
        name: formData.nextOfKinName,
        relationship: formData.nextOfKinRelationship,
        phone: formData.nextOfKinPhone,
      },
      deliveryAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
      items: cart,
      pricing: breakdown,
      purchaseType: formData.purchaseType,
      paymentPlan: parseInt(formData.paymentPlan),
      subscriptionPlan: formData.subscriptionPlan,
      insurance: formData.insurance,
    };

    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    setLocation('/confirm-order');
  };

  const nigerianStates = [
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "kano", label: "Kano" },
    { value: "rivers", label: "Rivers" },
    { value: "ogun", label: "Ogun" },
    { value: "kaduna", label: "Kaduna" }
  ];

  const installmentOptions = [
    { value: "2", label: "2 Months" },
    { value: "3", label: "3 Months" },
    { value: "4", label: "4 Months" },
    { value: "5", label: "5 Months" },
    { value: "6", label: "6 Months" }
  ];

  const paymentBreakdown = getPaymentBreakdown();

  return (
    <div className="min-h-screen bg-gradient-to-b from-lumiere-cream to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-lumiere-black mb-3">Complete Your Order</h1>
          <p className="text-lg text-lumiere-gray">Review your items and provide delivery information</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Customer Information */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Account Status */}
            {!isAuthenticated ? (
              <Card className="border-2 border-lumiere-gold">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="w-5 h-5 text-lumiere-gold" />
                    Account Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lumiere-gray mb-6">
                    Sign in to save your information and track orders easily, or continue as guest.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      className="bg-lumiere-gold hover:bg-lumiere-gold/90 text-white"
                      onClick={() => window.location.href = '/api/login'}
                    >
                      Sign In / Create Account
                    </Button>
                    <Button type="button" variant="outline">
                      Continue as Guest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Welcome back!</p>
                        <p className="text-sm text-green-600">{(user as any)?.email || 'User'}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = '/api/logout'}
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="bg-lumiere-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bvn">BVN *</Label>
                    <Input
                      id="bvn"
                      required
                      value={formData.bvn}
                      onChange={(e) => handleInputChange("bvn", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nin">NIN *</Label>
                    <Input
                      id="nin"
                      required
                      value={formData.nin}
                      onChange={(e) => handleInputChange("nin", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4">Next of Kin Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="nextOfKinName">Full Name *</Label>
                      <Input
                        id="nextOfKinName"
                        required
                        value={formData.nextOfKinName}
                        onChange={(e) => handleInputChange("nextOfKinName", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nextOfKinRelationship">Relationship *</Label>
                      <Select value={formData.nextOfKinRelationship} onValueChange={(value) => handleInputChange("nextOfKinRelationship", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="nextOfKinPhone">Phone Number *</Label>
                      <Input
                        id="nextOfKinPhone"
                        required
                        value={formData.nextOfKinPhone}
                        onChange={(e) => handleInputChange("nextOfKinPhone", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="bg-lumiere-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    required
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Additional Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="bg-lumiere-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                  <CreditCard className="w-5 h-5" />
                  Additional Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={formData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.checked)}
                    className="text-lumiere-gold"
                  />
                  <Label htmlFor="insurance" className="cursor-pointer">
                    Add Insurance Protection (2% of item value)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="text-lumiere-gold"
                    required
                  />
                  <Label htmlFor="agreeToTerms" className="cursor-pointer">
                    I agree to the <Link href="/terms" className="text-lumiere-gold hover:underline">Terms and Conditions</Link> *
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-lumiere-gray">Color: {item.color}</p>
                        <p className="text-xs text-lumiere-gray">Qty: {item.quantity}</p>
                        <p className="font-semibold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* New Payment Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(paymentBreakdown.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (7.5%)</span>
                    <span>{formatCurrency(paymentBreakdown.vat)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(paymentBreakdown.deliveryFee)}</span>
                  </div>
                  {formData.insurance && (
                    <div className="flex justify-between text-sm">
                      <span>Insurance (2%)</span>
                      <span>{formatCurrency(paymentBreakdown.insurance)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Order Total</span>
                    <span>{formatCurrency(paymentBreakdown.totalOrderValue)}</span>
                  </div>
                  
                  {/* Payment Structure */}
                  <div className="bg-lumiere-gold/10 p-4 rounded-lg space-y-3 mt-4">
                    <h4 className="font-semibold text-lumiere-black">Payment Structure</h4>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Down Payment (70%)</span>
                      <span className="font-bold text-lumiere-gold">{formatCurrency(paymentBreakdown.downPayment)}</span>
                    </div>
                    
                    {paymentBreakdown.paymentType === 'installment' && (
                      <>
                        <div className="text-sm text-lumiere-gray border-t pt-2">
                          <div className="flex justify-between mb-1">
                            <span>Remaining Balance (30%)</span>
                            <span>{formatCurrency(paymentBreakdown.remainingBalance)}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span>Service Fees ({paymentBreakdown.installmentMonths}× 5%)</span>
                            <span>{formatCurrency(paymentBreakdown.serviceFees)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Monthly Payment</span>
                            <span>{formatCurrency(paymentBreakdown.monthlyPayment)} × {paymentBreakdown.installmentMonths} months</span>
                          </div>
                        </div>
                        
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total with Fees</span>
                          <span className="text-lumiere-gold">{formatCurrency(paymentBreakdown.totalWithFees)}</span>
                        </div>
                      </>
                    )}
                    
                    {paymentBreakdown.paymentType === 'full' && (
                      <div className="text-sm text-green-600">
                        <span>✓ Full payment - No additional fees</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-lumiere-gold hover:bg-lumiere-gold/90 text-white py-3"
                  disabled={orderMutation.isPending || cart.length === 0}
                >
                  {orderMutation.isPending ? "Processing..." : "Continue to Payment"}
                </Button>

                <p className="text-xs text-lumiere-gray text-center">
                  Secure payment powered by Paystack
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}