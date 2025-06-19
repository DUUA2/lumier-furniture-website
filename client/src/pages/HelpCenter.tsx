import { Link } from "wouter";

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-lumiere-black mb-4">Help Center</h1>
          <p className="text-xl text-lumiere-gray">Find answers to frequently asked questions</p>
        </div>

        <div className="space-y-8">
          {/* Payment & Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">Payment & Orders</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">What payment options do you offer?</h3>
                <p className="text-lumiere-gray">We offer flexible payment plans including:</p>
                <ul className="list-disc list-inside text-lumiere-gray ml-4 mt-2">
                  <li>Buy outright with full payment</li>
                  <li>Installment plans (2-6 months with 5% monthly service fee)</li>
                  <li>Rent-to-own (1% monthly rental fee with optional insurance)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">How do I track my order?</h3>
                <p className="text-lumiere-gray">After placing your order, you'll receive a confirmation email with your order number. You can use this to track your order status and delivery updates.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What is required for checkout?</h3>
                <p className="text-lumiere-gray">You'll need to provide your BVN (Bank Verification Number), NIN (National Identification Number), delivery address, and next-of-kin information for security and delivery purposes.</p>
              </div>
            </div>
          </div>

          {/* Rental Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">Rental Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">How does the rent-to-own program work?</h3>
                <p className="text-lumiere-gray">Pay just 1% of the item's value monthly. After 12 months, you own the furniture. Optional insurance (2% of item value) covers damage protection and maintenance.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">What happens if I want to return rental items early?</h3>
                <p className="text-lumiere-gray">You can return rental items anytime with 30 days notice. Your rental payments do not count toward ownership if returned early.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Is insurance mandatory for rentals?</h3>
                <p className="text-lumiere-gray">Insurance is optional but recommended. It covers damage protection and maintenance for 2% of the item's value monthly.</p>
              </div>
            </div>
          </div>

          {/* Delivery & Installation */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">Delivery & Installation</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer delivery across Nigeria?</h3>
                <p className="text-lumiere-gray">Yes, we deliver nationwide. Delivery fees vary by state and are calculated during checkout.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Is assembly included?</h3>
                <p className="text-lumiere-gray">Basic assembly is included for most furniture items. Complex installations may incur additional fees.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How long does delivery take?</h3>
                <p className="text-lumiere-gray">Standard delivery takes 3-7 business days within Lagos and 5-14 business days for other states, depending on location.</p>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">Product Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Are your products authentic?</h3>
                <p className="text-lumiere-gray">All our furniture is sourced from reputable manufacturers and comes with quality guarantees.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I see the furniture before buying?</h3>
                <p className="text-lumiere-gray">We have showrooms in major cities. Contact us to schedule a viewing appointment.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer custom colors or modifications?</h3>
                <p className="text-lumiere-gray">Many of our products are available in multiple colors. Custom modifications may be available for certain items - contact us for details.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lumiere-gray mb-4">Still have questions?</p>
          <Link href="/contact">
            <button className="bg-lumiere-gold text-lumiere-black px-8 py-3 rounded-lg font-semibold hover:bg-lumiere-gold/90 transition-colors">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}