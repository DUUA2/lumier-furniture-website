import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/use-cart";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bvn: "",
    nextOfKinName: "",
    nextOfKinPhone: "",
    street: "",
    city: "",
    state: "",
    paymentPlan: "1"
  });

  const [selectedState, setSelectedState] = useState("");

  const { data: deliveryFeeData } = useQuery({
    queryKey: [`/api/delivery-fee/${selectedState}`],
    enabled: !!selectedState,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: (data) => {
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

  if (cart.length === 0) {
    setLocation("/cart");
    return null;
  }

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const vat = Math.round(subtotal * 0.075);
  const deliveryFee = deliveryFeeData?.fee || 5000;
  const total = subtotal + vat + deliveryFee;
  const paymentPlan = parseInt(formData.paymentPlan);
  const monthlyPayment = Math.round(total / paymentPlan);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    handleInputChange("state", value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      customerEmail: formData.email,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhone: formData.phone,
      deliveryAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state
      },
      nextOfKin: {
        name: formData.nextOfKinName,
        phone: formData.nextOfKinPhone
      },
      bvn: formData.bvn,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: item.type,
        color: item.color
      })),
      subtotal,
      vat,
      deliveryFee,
      total,
      paymentPlan,
      monthlyPayment,
      paymentStatus: "pending"
    };

    // Simulate Paystack payment
    toast({
      title: "Processing Payment",
      description: "Please wait while we process your payment...",
    });

    setTimeout(() => {
      createOrderMutation.mutate(orderData);
    }, 2000);
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
    { value: "1", label: "1 Month" },
    { value: "3", label: "3 Months" },
    { value: "6", label: "6 Months" },
    { value: "9", label: "9 Months" },
    { value: "12", label: "12 Months" },
    { value: "24", label: "24 Months" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
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
              <div className="sm:col-span-2">
                <Label htmlFor="bvn">BVN (Bank Verification Number) *</Label>
                <Input
                  id="bvn"
                  required
                  maxLength={11}
                  value={formData.bvn}
                  onChange={(e) => handleInputChange("bvn", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Next of Kin */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Next of Kin Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nextOfKinName">Next of Kin Name *</Label>
                <Input
                  id="nextOfKinName"
                  required
                  value={formData.nextOfKinName}
                  onChange={(e) => handleInputChange("nextOfKinName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nextOfKinPhone">Next of Kin Phone *</Label>
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
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Select value={formData.state} onValueChange={handleStateChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
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
              </div>
            </div>
          </div>

          {/* Payment Plan */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Plan</h3>
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
          </div>
        </div>

        {/* Order Summary */}
        <div>
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
                    <p className="text-xs text-lumier-gray">Qty: {item.quantity}</p>
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
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
              <div className="bg-lumier-gold/20 p-3 rounded-lg mt-4">
                <div className="text-center">
                  <span className="text-sm">Monthly Payment:</span>
                  <div className="text-lg font-bold text-lumier-gold">
                    ₦{monthlyPayment.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90 mt-6"
              size="lg"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? "Processing..." : "Confirm & Pay"}
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
