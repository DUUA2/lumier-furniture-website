import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const [formData, setFormData] = useState({
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
    purchaseType: "buy", // "buy" or "installment"
    paymentPlan: "2",
    insurance: false,
    agreeToTerms: false
  });

  const [selectedState, setSelectedState] = useState("");

  const { data: deliveryFeeData } = useQuery({
    queryKey: [`/api/delivery-fee/${selectedState}`],
    enabled: !!selectedState,
  });

  // Move all hooks before any conditional returns
  useEffect(() => {
    if (formData.state) {
      setSelectedState(formData.state);
    }
  }, [formData.state]);

  // Auto-populate form data if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const userData = user as any;
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: (data: any) => {
      localStorage.setItem('lastOrder', JSON.stringify({
        id: data.id,
        total: data.total,
        plan: data.paymentPlan,
        monthly: data.monthlyPayment
      }));
      clearCart();
      setLocation("/thankyou");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process order. Please try again.",
        variant: "destructive",
      });
    }
  });

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const vat = Math.round(subtotal * 0.075);
  const deliveryFee = (deliveryFeeData as any)?.fee || 5000;
  const paymentPlan = parseInt(formData.paymentPlan);
  
  // Enhanced payment calculations
  const insurance = formData.insurance ? Math.round(subtotal * 0.02) : 0; // 2% insurance
  const baseTotal = subtotal + vat + deliveryFee + insurance;
  
  // Service fees: 5% per month for installment plans (only if installment selected)
  const serviceFees = formData.purchaseType === "installment" ? Math.round(subtotal * (0.05 * paymentPlan)) : 0;
  
  const total = baseTotal + serviceFees;
  const monthlyPayment = Math.round(total / paymentPlan);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate terms agreement for installment purchases
    if (formData.purchaseType === "installment" && !formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the installment payment terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    // Prepare order data for confirmation page
    const orderData = {
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bvn: formData.bvn,
        nin: formData.nin,
      },
      deliveryAddress: {
        address: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
      nextOfKin: {
        name: formData.nextOfKinName,
        relationship: formData.nextOfKinRelationship,
        phone: formData.nextOfKinPhone,
      },
      paymentPlan: {
        type: formData.purchaseType,
        months: formData.purchaseType === "installment" ? parseInt(formData.paymentPlan) : undefined,
        insurance: formData.insurance,
      },
      deliveryFee: deliveryFee,
    };

    // Save order data to localStorage and redirect to confirmation page
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

  const paymentPlans = [
    { value: "2", label: "2 Months" },
    { value: "3", label: "3 Months" },
    { value: "4", label: "4 Months" },
    { value: "5", label: "5 Months" },
    { value: "6", label: "6 Months" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Account Options */}
          {!isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle>Account Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-lumier-gray mb-4">
                    Create an account to save your information and track orders easily, or continue as guest.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.location.href = '/api/login'}
                      className="w-full"
                    >
                      Sign In / Create Account
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAuthOptions(false)}
                      className="w-full"
                    >
                      Continue as Guest
                    </Button>
                  </div>
                  
                  <p className="text-xs text-lumier-gray text-center">
                    Returning customer? Sign in to auto-fill your information
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Logged In User Info */}
          {isAuthenticated && user && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Welcome back!</p>
                    <p className="text-sm text-lumier-gray">{(user as any)?.email || 'User'}</p>
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

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Verification Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Verification Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bvn">Bank Verification Number (BVN) *</Label>
                <Input
                  id="bvn"
                  required
                  value={formData.bvn}
                  onChange={(e) => handleInputChange("bvn", e.target.value)}
                  placeholder="Enter your 11-digit BVN"
                />
              </div>
              <div>
                <Label htmlFor="nin">National Identification Number (NIN) *</Label>
                <Input
                  id="nin"
                  required
                  value={formData.nin}
                  onChange={(e) => handleInputChange("nin", e.target.value)}
                  placeholder="Enter your 11-digit NIN"
                />
              </div>
            </div>
          </div>

          {/* Next of Kin Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Next of Kin Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nextOfKinName">Full Name *</Label>
                <Input
                  id="nextOfKinName"
                  required
                  value={formData.nextOfKinName}
                  onChange={(e) => handleInputChange("nextOfKinName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nextOfKinRelationship">Relationship *</Label>
                <Input
                  id="nextOfKinRelationship"
                  required
                  value={formData.nextOfKinRelationship}
                  onChange={(e) => handleInputChange("nextOfKinRelationship", e.target.value)}
                  placeholder="e.g. Brother, Sister, Spouse"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="nextOfKinPhone">Phone Number *</Label>
                <Input
                  id="nextOfKinPhone"
                  type="tel"
                  required
                  value={formData.nextOfKinPhone}
                  onChange={(e) => handleInputChange("nextOfKinPhone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  required
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  placeholder="Enter your street address"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Purchase Options */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Purchase Options</h3>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <label
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.purchaseType === "buy"
                    ? 'border-lumier-gold bg-lumier-gold/10'
                    : 'border-gray-300 hover:border-lumier-gold'
                }`}
              >
                <input
                  type="radio"
                  name="purchaseType"
                  value="buy"
                  checked={formData.purchaseType === "buy"}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseType: e.target.value }))}
                  className="sr-only"
                />
                <div>
                  <span className="text-lg font-medium">Buy Outright</span>
                  <p className="text-sm text-gray-600 mt-1">Pay full amount upfront with no additional fees</p>
                </div>
              </label>
              
              <label
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.purchaseType === "installment"
                    ? 'border-lumier-gold bg-lumier-gold/10'
                    : 'border-gray-300 hover:border-lumier-gold'
                }`}
              >
                <input
                  type="radio"
                  name="purchaseType"
                  value="installment"
                  checked={formData.purchaseType === "installment"}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseType: e.target.value }))}
                  className="sr-only"
                />
                <div>
                  <span className="text-lg font-medium">Installment Plan</span>
                  <p className="text-sm text-gray-600 mt-1">Flexible payment plans with 5% monthly service fee</p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Plan - Only show for installment */}
          {formData.purchaseType === "installment" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Installment Period</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {paymentPlans.map((plan) => (
                  <label
                    key={plan.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.paymentPlan === plan.value
                        ? 'border-lumier-gold bg-lumier-gold/10'
                        : 'border-gray-300 hover:border-lumier-gold'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentPlan"
                      value={plan.value}
                      checked={formData.paymentPlan === plan.value}
                      onChange={(e) => handleInputChange("paymentPlan", e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{plan.label}</span>
                  </label>
                ))}
              </div>
              
              {/* Insurance Option */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.insurance}
                    onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.checked }))}
                    className="mt-1 h-4 w-4 text-lumier-gold focus:ring-lumier-gold border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Add Insurance Protection</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Protect your purchase with comprehensive coverage for 2% of item value
                    </p>
                  </div>
                </label>
              </div>
              
              {/* Terms Agreement for Installment Plans */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="mt-1 h-4 w-4 text-lumier-gold focus:ring-lumier-gold border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      I agree to the <Link href="/terms" className="text-lumier-gold hover:underline">installment payment terms and conditions</Link>
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      Required for installment purchases - includes credit check and payment schedule
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">
                      Color: {item.color} | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-sm">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            
            <hr className="my-4" />
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (7.5%):</span>
                <span>₦{vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              {formData.insurance && (
                <div className="flex justify-between">
                  <span>Insurance (2%):</span>
                  <span>₦{insurance.toLocaleString()}</span>
                </div>
              )}
              {formData.purchaseType === "installment" && (
                <div className="flex justify-between">
                  <span>Service Fee ({paymentPlan * 5}% total):</span>
                  <span>₦{serviceFees.toLocaleString()}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
              {formData.purchaseType === "installment" && (
                <div className="bg-lumier-gold/20 p-3 rounded-lg mt-4">
                  <div className="text-center">
                    <span className="text-sm">Monthly Payment:</span>
                    <div className="text-lg font-bold text-lumier-gold">
                      ₦{monthlyPayment.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90 mt-6"
              size="lg"
              disabled={createOrderMutation.isPending}
            >
Review Order
            </Button>
            
            <p className="text-xs text-lumier-gray text-center mt-3">
              Secure payment powered by Paystack
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}