// Payment and pricing configuration for easy backend management
export const PAYMENT_CONFIG = {
  // VAT rate (7.5% for Nigeria)
  VAT_RATE: 0.075,
  
  // Down payment percentage (70% of total cost)
  DOWN_PAYMENT_RATE: 0.70,
  
  // Remaining balance rate (30% of total cost)
  REMAINING_BALANCE_RATE: 0.30,
  
  // Monthly service fee rate for installments (5% per month on remaining balance)
  SERVICE_FEE_RATE: 0.05,
  
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
  
  // Updated installment payment plan options (2-6 months for remaining 30%)
  INSTALLMENT_PLANS: [
    { value: "2", label: "2 Months", months: 2 },
    { value: "3", label: "3 Months", months: 3 },
    { value: "4", label: "4 Months", months: 4 },
    { value: "5", label: "5 Months", months: 5 },
    { value: "6", label: "6 Months", months: 6 }
  ]
};

// Calculate new payment breakdown with 70% down payment + 30% installments
export function calculatePaymentBreakdown(
  subtotal: number,
  installmentMonths: number = 0,
  deliveryFee: number = PAYMENT_CONFIG.DELIVERY_FEES.DEFAULT,
  includeInsurance: boolean = false
) {
  const vat = Math.round(subtotal * PAYMENT_CONFIG.VAT_RATE);
  
  // Calculate insurance if selected
  const insurance = includeInsurance 
    ? Math.round(subtotal * PAYMENT_CONFIG.INSURANCE.RATE) 
    : 0;
  
  // Total order value including VAT, delivery, and insurance
  const totalOrderValue = subtotal + vat + deliveryFee + insurance;
  
  // Calculate 70% down payment
  const downPayment = Math.round(totalOrderValue * PAYMENT_CONFIG.DOWN_PAYMENT_RATE);
  
  // Calculate 30% remaining balance
  const remainingBalance = Math.round(totalOrderValue * PAYMENT_CONFIG.REMAINING_BALANCE_RATE);
  
  if (installmentMonths === 0) {
    // Full payment option
    return {
      subtotal,
      vat,
      deliveryFee,
      insurance,
      totalOrderValue,
      downPayment: totalOrderValue, // Full payment
      remainingBalance: 0,
      serviceFees: 0,
      totalWithFees: totalOrderValue,
      monthlyPayment: 0,
      installmentMonths: 0,
      paymentType: 'full'
    };
  }
  
  // Calculate service fees for installment plan (5% per month on remaining balance)
  const serviceFees = Math.round(remainingBalance * PAYMENT_CONFIG.SERVICE_FEE_RATE * installmentMonths);
  
  // Total remaining balance with service fees
  const totalRemainingWithFees = remainingBalance + serviceFees;
  
  // Monthly payment for remaining balance
  const monthlyPayment = Math.round(totalRemainingWithFees / installmentMonths);
  
  // Final total (down payment + remaining balance + service fees)
  const finalTotal = downPayment + totalRemainingWithFees;
  
  return {
    subtotal,
    vat,
    deliveryFee,
    insurance,
    totalOrderValue,
    downPayment,
    remainingBalance,
    serviceFees,
    totalWithFees: finalTotal,
    monthlyPayment,
    installmentMonths,
    paymentType: 'installment'
  };
}