import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, CreditCard, FileText, Clock, Recycle, Star, Calendar } from "lucide-react";

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
        <h1 className="text-3xl font-bold">Payment Plans & Subscription Services</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        {/* Overview */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-lumiere-gold" />
            Overview
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Lumiere Furniture offers multiple ways to enjoy premium furniture that fits your lifestyle and budget. 
            Choose from traditional purchase with installment plans, or discover our innovative subscription service 
            that brings flexibility and sustainability to furniture ownership.
          </p>
        </div>

        {/* Installment Periods */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-lumiere-gold" />
            Available Installment Periods
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {[2, 3, 4, 5, 6].map((months) => (
              <div key={months} className="bg-lumiere-gold/10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-lumiere-gold">{months}</div>
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
            <CreditCard className="h-6 w-6 text-lumiere-gold" />
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
            <Shield className="h-6 w-6 text-lumiere-gold" />
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
          <div className="bg-lumiere-gold/10 rounded-lg p-4">
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

        {/* Subscription Service Section */}
        <div className="border-t pt-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Subscription Furniture Service</h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Experience luxury furniture with complete flexibility and sustainability
          </p>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border">
              <div className="text-center mb-4">
                <Star className="h-8 w-8 text-lumiere-gold mx-auto mb-2" />
                <h3 className="text-xl font-bold">Basic Plan</h3>
                <div className="text-3xl font-bold text-lumiere-gold">₦15,000</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• 1-2 furniture pieces</li>
                <li>• Basic customization options</li>
                <li>• Quarterly refresh available</li>
                <li>• Standard delivery</li>
                <li>• Email support</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-lumiere-gold/10 to-lumiere-gold/20 p-6 rounded-xl border-2 border-lumiere-gold relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-lumiere-gold text-white px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-center mb-4">
                <Star className="h-8 w-8 text-lumiere-gold mx-auto mb-2" />
                <h3 className="text-xl font-bold">Premium Plan</h3>
                <div className="text-3xl font-bold text-lumiere-gold">₦25,000</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• 3-4 furniture pieces</li>
                <li>• Full customization options</li>
                <li>• Monthly refresh available</li>
                <li>• AR preview & virtual showroom</li>
                <li>• Priority delivery</li>
                <li>• Phone & chat support</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-xl border">
              <div className="text-center mb-4">
                <Star className="h-8 w-8 text-lumiere-gold mx-auto mb-2" />
                <h3 className="text-xl font-bold">Elite Plan</h3>
                <div className="text-3xl font-bold text-lumiere-gold">₦40,000</div>
                <div className="text-sm text-gray-300">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• 5+ furniture pieces</li>
                <li>• Premium customization & design</li>
                <li>• Bi-weekly refresh available</li>
                <li>• Personal design consultation</li>
                <li>• Same-day delivery</li>
                <li>• 24/7 concierge support</li>
              </ul>
            </div>
          </div>

          {/* Subscription Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Recycle className="h-6 w-6 text-lumiere-gold" />
                Seasonal Refresh Program
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Swap furniture every 3-6 months</li>
                <li>• Stay current with design trends</li>
                <li>• Automated reminders for refresh dates</li>
                <li>• Easy scheduling through your dashboard</li>
                <li>• No additional costs within plan limits</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-lumiere-gold" />
                Subscription Benefits
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• No large upfront payments</li>
                <li>• Maintenance & repairs included</li>
                <li>• Insurance coverage provided</li>
                <li>• Flexible upgrade/downgrade options</li>
                <li>• Sustainable furniture lifecycle</li>
              </ul>
            </div>
          </div>

          {/* Subscription Terms */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Subscription Terms & Conditions</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Minimum Commitment:</strong> 3-month minimum subscription period for all plans.
              </p>
              <p>
                <strong>Cancellation:</strong> Cancel anytime after minimum period with 30-day notice.
              </p>
              <p>
                <strong>Damage Policy:</strong> Normal wear included. Significant damage may incur additional charges.
              </p>
              <p>
                <strong>Delivery & Setup:</strong> Professional delivery and setup included in all plans.
              </p>
              <p>
                <strong>Customization:</strong> Custom colors, fabrics, and configurations available based on plan level.
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <Link href="/subscription">
              <Button className="bg-lumiere-gold hover:bg-lumiere-gold/90 text-lumiere-black px-8 py-3 mr-4">
                Explore Subscription Plans
              </Button>
            </Link>
            <Link href="/checkout">
              <Button variant="outline" className="px-8 py-3">
                Continue with Purchase
              </Button>
            </Link>
          </div>
        </div>

        {/* Agreement Statement */}
        <div className="bg-gray-100 border-l-4 border-lumiere-gold p-4">
          <p className="text-sm text-gray-700">
            By proceeding with any payment plan or subscription service, you acknowledge that you have read, 
            understood, and agree to these terms and conditions. This agreement is legally 
            binding and subject to Nigerian consumer protection laws.
          </p>
        </div>
      </div>
    </div>
  );
}