// Payment calculation utilities for the new 70% down payment system

export interface PaymentBreakdown {
  subtotal: number;
  vat: number;
  deliveryFee: number;
  insurance: number;
  totalOrderValue: number;
  downPayment: number;
  remainingBalance: number;
  serviceFees: number;
  totalWithFees: number;
  monthlyPayment: number;
  installmentMonths: number;
  paymentType: 'full' | 'installment';
}

export function calculatePaymentBreakdown(
  cartTotal: number,
  installmentMonths: number = 0,
  includeInsurance: boolean = false,
  deliveryFee: number = 5000
): PaymentBreakdown {
  const subtotal = cartTotal;
  const vat = Math.round(subtotal * 0.075); // 7.5% VAT
  const insurance = includeInsurance ? Math.round(subtotal * 0.02) : 0; // 2% insurance
  const totalOrderValue = subtotal + vat + deliveryFee + insurance;
  
  // Calculate 70% down payment
  const downPayment = Math.round(totalOrderValue * 0.70);
  
  // Calculate 30% remaining balance
  const remainingBalance = Math.round(totalOrderValue * 0.30);
  
  if (installmentMonths === 0) {
    // Full payment option
    return {
      subtotal,
      vat,
      deliveryFee,
      insurance,
      totalOrderValue,
      downPayment: totalOrderValue,
      remainingBalance: 0,
      serviceFees: 0,
      totalWithFees: totalOrderValue,
      monthlyPayment: 0,
      installmentMonths: 0,
      paymentType: 'full'
    };
  }
  
  // Calculate service fees for installment plan (5% per month on remaining balance)
  const serviceFees = Math.round(remainingBalance * 0.05 * installmentMonths);
  
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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}