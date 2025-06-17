// Payment and pricing configuration for easy backend management
export const PAYMENT_CONFIG = {
  // VAT rate (7.5% for Nigeria)
  VAT_RATE: 0.075,
  
  // Monthly rental fee rate (1% per installment)
  RENTAL_FEE_RATE: 0.01,
  
  // Insurance options
  INSURANCE: {
    ENABLED: true,
    RATE: 0.02, // 2% of item value
    DESCRIPTION: "Comprehensive protection for your furniture"
  },
  
  // Delivery fees by state
  DELIVERY_FEES: {
    "Lagos": 3000,
    "Abuja": 4000,
    "Port Harcourt": 5000,
    "Kano": 6000,
    "Ibadan": 4500,
    "Kaduna": 5500,
    "Jos": 6000,
    "Enugu": 5000,
    "Benin": 4500,
    "Warri": 5000,
    "DEFAULT": 5000
  },
  
  // Payment plan options
  PAYMENT_PLANS: [
    { value: "1", label: "1 Month", months: 1 },
    { value: "3", label: "3 Months", months: 3 },
    { value: "6", label: "6 Months", months: 6 },
    { value: "9", label: "9 Months", months: 9 },
    { value: "12", label: "12 Months", months: 12 },
    { value: "24", label: "24 Months", months: 24 }
  ]
};

// Calculate enhanced payment breakdown
export function calculatePaymentBreakdown(
  subtotal: number,
  paymentPlan: number,
  deliveryFee: number = PAYMENT_CONFIG.DELIVERY_FEES.DEFAULT,
  includeInsurance: boolean = false
) {
  const vat = Math.round(subtotal * PAYMENT_CONFIG.VAT_RATE);
  
  // Calculate insurance if selected
  const insurance = includeInsurance 
    ? Math.round(subtotal * PAYMENT_CONFIG.INSURANCE.RATE) 
    : 0;
  
  // Base total before rental fees
  const baseTotal = subtotal + vat + deliveryFee + insurance;
  
  // Calculate rental fees for installment plans (1% per month total, e.g., 3 months = 3%)
  const rentalFees = paymentPlan > 1 
    ? Math.round(subtotal * PAYMENT_CONFIG.RENTAL_FEE_RATE * paymentPlan)
    : 0;
  
  const finalTotal = baseTotal + rentalFees;
  const monthlyPayment = Math.round(finalTotal / paymentPlan);
  
  return {
    subtotal,
    vat,
    deliveryFee,
    insurance,
    rentalFees,
    baseTotal,
    finalTotal,
    monthlyPayment,
    paymentPlan
  };
}