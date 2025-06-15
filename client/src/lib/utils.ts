import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateVAT(amount: number, rate: number = 0.075): number {
  return Math.round(amount * rate);
}

export function calculateMonthlyPayment(total: number, months: number): number {
  return Math.round(total / months);
}

export function generateOrderNumber(id: number): string {
  return `LF-2024-${id.toString().padStart(3, '0')}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateBVN(bvn: string): boolean {
  return /^\d{11}$/.test(bvn);
}

export function validatePhoneNumber(phone: string): boolean {
  return /^(\+234|234|0)?[789]\d{9}$/.test(phone.replace(/\s/g, ''));
}
