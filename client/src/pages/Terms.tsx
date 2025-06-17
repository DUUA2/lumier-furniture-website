import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, CreditCard, FileText, Clock } from "lucide-react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/checkout">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkout
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Installment Payment Terms & Conditions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        {/* Overview */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-lumier-gold" />
            Overview
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Lumier Furniture offers flexible installment payment plans to make luxury furniture 
            more accessible. Our in-house financing allows you to enjoy your furniture immediately 
            while spreading payments over your chosen period.
          </p>
        </div>

        {/* Installment Periods */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-lumier-gold" />
            Available Installment Periods
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {[2, 3, 4, 5, 6].map((months) => (
              <div key={months} className="bg-lumier-gold/10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-lumier-gold">{months}</div>
                <div className="text-sm text-gray-600">Month{months > 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-700">
            Choose from 2 to 6-month payment plans that best suit your budget and preferences.
          </p>
        </div>

        {/* Service Fees */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-lumier-gold" />
            Service Fees & Charges
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Monthly Service Fee: 5%</h3>
            <p className="text-yellow-700">
              A 5% service fee per month is applied to the outstanding balance during the installment period.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Additional Charges:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>VAT (7.5%) on all purchases</li>
              <li>Delivery fees based on your location</li>
              <li>Optional insurance coverage (2% of item value)</li>
            </ul>
          </div>
        </div>

        {/* Eligibility Requirements */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-lumier-gold" />
            Eligibility Requirements
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Required Documentation</h3>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Valid government-issued identification</li>
                <li>Bank Verification Number (BVN)</li>
                <li>National Identification Number (NIN)</li>
                <li>Proof of income or employment</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Credit Assessment</h3>
              <p className="text-green-700">
                All customers must agree to a credit check as part of our in-house financing qualification process. 
                This helps us ensure responsible lending and protects both parties.
              </p>
            </div>
          </div>
        </div>

        {/* Insurance Coverage */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Insurance Coverage</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Optional Protection Plan</h3>
            <p className="text-gray-700 mb-3">
              Protect your furniture investment with our comprehensive insurance coverage at 2% of the item value.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="font-medium">Damage Protection</div>
                <div className="text-sm text-gray-600">Accidental damage coverage</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Maintenance</div>
                <div className="text-sm text-gray-600">Professional cleaning & repairs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Due Date:</strong> Monthly payments are due on the same date each month as your initial purchase.
            </p>
            <p>
              <strong>Payment Methods:</strong> Payments can be made via bank transfer, debit card, or at our showroom locations.
            </p>
            <p>
              <strong>Late Payments:</strong> A late fee of ₦2,500 will be charged for payments received after the due date.
            </p>
            <p>
              <strong>Early Payment:</strong> You may pay off your balance early without penalty. Service fees are only charged on the outstanding balance.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact & Support</h2>
          <div className="bg-lumier-gold/10 rounded-lg p-4">
            <p className="text-gray-700 mb-2">
              For questions about your installment plan or to make payments:
            </p>
            <div className="space-y-1">
              <p><strong>Phone:</strong> +234 800 LUMIER (586437)</p>
              <p><strong>Email:</strong> finance@lumierfurniture.com</p>
              <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Agreement Statement */}
        <div className="bg-gray-100 border-l-4 border-lumier-gold p-4">
          <p className="text-sm text-gray-700">
            By proceeding with an installment purchase, you acknowledge that you have read, 
            understood, and agree to these terms and conditions. This agreement is legally 
            binding and subject to Nigerian consumer protection laws.
          </p>
        </div>
      </div>
    </div>
  );
}