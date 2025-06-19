import { Link } from "wouter";

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-lumiere-black mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-lumiere-gray">Easy returns and exchanges for your peace of mind</p>
        </div>

        <div className="space-y-8">
          {/* Return Policy */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">Return Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">30-Day Return Window</h3>
                <p className="text-lumiere-gray">You can return most items within 30 days of delivery for a full refund, provided they are in original condition.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">What can be returned?</h3>
                <ul className="list-disc list-inside text-lumiere-gray ml-4">
                  <li>Furniture in original packaging and condition</li>
                  <li>Items with all original tags and documentation</li>
                  <li>Unused accessories and decor items</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What cannot be returned?</h3>
                <ul className="list-disc list-inside text-lumiere-gray ml-4">
                  <li>Custom-made or personalized furniture</li>
                  <li>Items damaged by customer use</li>
                  <li>Mattresses and bedding (for hygiene reasons)</li>
                  <li>Clearance or final sale items</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rental Returns */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">Rental Returns</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Early Return Policy</h3>
                <p className="text-lumiere-gray">Rental items can be returned anytime with 30 days advance notice. You'll only pay for the months you've used the furniture.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Condition Requirements</h3>
                <p className="text-lumiere-gray">Rental items must be returned in good condition. Normal wear and tear is acceptable, but excessive damage may result in additional charges.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">End of Rental Period</h3>
                <p className="text-lumiere-gray">After 12 months of rental payments, the furniture becomes yours. No return necessary - you own it!</p>
              </div>
            </div>
          </div>

          {/* How to Return */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">How to Return Items</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-lumiere-gold text-lumiere-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                  <h3 className="font-semibold mb-2">Contact Us</h3>
                  <p className="text-lumiere-gray text-sm">Call or email our support team to initiate your return request.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-lumiere-gold text-lumiere-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                  <h3 className="font-semibold mb-2">Schedule Pickup</h3>
                  <p className="text-lumiere-gray text-sm">We'll arrange a convenient pickup time and provide return instructions.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-lumiere-gold text-lumiere-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                  <h3 className="font-semibold mb-2">Get Refunded</h3>
                  <p className="text-lumiere-gray text-sm">Once we receive and inspect the item, your refund will be processed within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Policy */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">Exchanges</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Size or Color Changes</h3>
                <p className="text-lumiere-gray">If you need a different size or color, we can arrange an exchange within 30 days. You'll only pay the difference if the new item costs more.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Defective Items</h3>
                <p className="text-lumiere-gray">Defective items can be exchanged immediately at no cost. We'll expedite the replacement to minimize inconvenience.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Upgrade Options</h3>
                <p className="text-lumiere-gray">Want to upgrade to a premium model? We offer flexible exchange options with credit toward your new purchase.</p>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-lumiere-black mb-4">Refund Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Processing Time</h3>
                <p className="text-lumiere-gray">Refunds are processed within 5-7 business days after we receive the returned item.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Refund Method</h3>
                <p className="text-lumiere-gray">Refunds are issued to the original payment method. For installment purchases, remaining payments will be canceled.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Return Shipping</h3>
                <p className="text-lumiere-gray">We cover return pickup costs for defective items. For other returns, a small pickup fee may apply.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lumiere-gray mb-4">Need help with a return?</p>
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