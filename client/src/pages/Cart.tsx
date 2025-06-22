import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const vat = Math.round(subtotal * 0.075);
  const delivery = 5000;
  const total = subtotal + vat + delivery;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-lumiere-gray mb-2">Your cart is empty</h2>
          <p className="text-lumiere-gray mb-6">Add some furniture to get started</p>
          <Link href="/explore">
            <Button className="bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="space-y-6 mb-8">
        {cart.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{item.name}</h3>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm text-lumiere-gray capitalize">
                  Color: {item.color}
                </p>
                {item.paymentType && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.paymentType === 'full' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.paymentType === 'full' ? 'Full Payment' : `${item.installmentDuration}mo Installment`}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold">₦{item.price.toLocaleString()}</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeFromCart(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
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
            <span>₦{delivery.toLocaleString()}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
        <Link href="/checkout" className="block w-full">
          <Button 
            className="w-full bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90 mt-6" 
            size="lg"
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
