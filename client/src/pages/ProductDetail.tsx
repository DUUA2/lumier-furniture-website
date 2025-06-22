import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { Star, Heart, Share2, Camera, Palette } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ARShowroom from "@/components/ARShowroom";
import CustomizationPanel from "@/components/CustomizationPanel";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = parseInt(params?.id || "0");
  
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [paymentType, setPaymentType] = useState<'full' | 'installment'>('full');
  const [installmentDuration, setInstallmentDuration] = useState<number>(2);
  const [mainImage, setMainImage] = useState<string>("");
  const [showARShowroom, setShowARShowroom] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizations, setCustomizations] = useState<any>({});

  const { addToCart, updateCartItem, findExistingCartItem } = useCart();

  const { data: product } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const relatedProducts = allProducts
    .filter(p => p.id !== productId && p.category === product?.category)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
          <p className="text-lumiere-gray">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  if (!mainImage) {
    setMainImage(product.image);
  }

  const handleAddToCart = () => {
    const cartItemType: 'buy' | 'rent' | 'installment' = paymentType === 'full' ? 'buy' : 'installment';
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      type: cartItemType,
      color: selectedColor || product.colors[0],
      paymentType,
      installmentDuration: paymentType === 'installment' ? installmentDuration : undefined
    };

    // Check if this exact configuration already exists in cart
    const existingIndex = findExistingCartItem(
      product.id, 
      selectedColor || product.colors[0], 
      paymentType, 
      paymentType === 'installment' ? installmentDuration : undefined
    );

    if (existingIndex !== -1) {
      // Update existing cart item configuration
      updateCartItem(cartItem);
    } else {
      // Add new item to cart
      addToCart(cartItem);
    }
  };

  const getAvailabilityStatus = () => {
    if (product.inStock) {
      return { text: 'In Stock', variant: 'default' as const };
    } else if (product.availableForPreOrder) {
      return { text: 'Available for Pre-order', variant: 'secondary' as const };
    } else {
      return { text: 'Out of Stock', variant: 'destructive' as const };
    }
  };

  const availability = getAvailabilityStatus();
  const canAddToCart = product.inStock || product.availableForPreOrder;

  const getFullPaymentBreakdown = () => {
    const subtotal = product.price;
    const vat = Math.round(subtotal * 0.075);
    const totalWithVat = subtotal + vat;
    
    return {
      displayText: `₦${totalWithVat.toLocaleString()}`,
      subtitle: "Pay full amount upfront - No additional fees"
    };
  };

  const getInstallmentBreakdown = () => {
    const subtotal = product.price;
    const vat = Math.round(subtotal * 0.075);
    const totalWithVat = subtotal + vat;
    const downPayment = Math.round(totalWithVat * 0.7);
    const remainingBalance = totalWithVat - downPayment;
    const monthlyServiceFee = Math.round(remainingBalance * 0.05);
    const monthlyPayment = Math.round(remainingBalance / installmentDuration) + monthlyServiceFee;
    
    return {
      displayText: `₦${downPayment.toLocaleString()} down`,
      subtitle: `Then ₦${monthlyPayment.toLocaleString()}/month for ${installmentDuration} months`,
      downPayment,
      remainingBalance,
      monthlyPayment
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[product.image, ...Array(3).fill(product.image)].map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                  mainImage === image ? 'border-lumiere-gold' : 'border-transparent hover:border-lumiere-gold'
                }`}
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex text-lumiere-gold">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <Star className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm text-lumiere-gray">(24 reviews)</span>
            </div>
            <div className="flex gap-2">
              <Badge variant={availability.variant}>
                {availability.text}
              </Badge>
              {product.availableForInstallment && (
                <Badge variant="outline" className="text-purple-700 border-purple-300">
                  Installment Payment
                </Badge>
              )}
            </div>
          </div>

          {/* Payment Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
            <div className="space-y-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentType === 'full' ? 'border-lumiere-gold bg-lumiere-gold/10' : 'border-gray-300 hover:border-lumiere-gold/50'
                }`}
                onClick={() => setPaymentType('full')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={paymentType === 'full'}
                      onChange={() => setPaymentType('full')}
                      className="mr-3"
                    />
                    <div>
                      <h4 className="font-semibold">Full Payment</h4>
                      <p className="text-sm text-gray-600">Pay complete amount upfront</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-lumiere-gold">
                      {getFullPaymentBreakdown().displayText}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getFullPaymentBreakdown().subtitle}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentType === 'installment' ? 'border-lumiere-gold bg-lumiere-gold/10' : 'border-gray-300 hover:border-lumiere-gold/50'
                }`}
                onClick={() => setPaymentType('installment')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={paymentType === 'installment'}
                      onChange={() => setPaymentType('installment')}
                      className="mr-3"
                    />
                    <div>
                      <h4 className="font-semibold">Down Payment + Installments</h4>
                      <p className="text-sm text-gray-600">70% down + 30% in monthly payments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-lumiere-gold">
                      {getInstallmentBreakdown().displayText}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getInstallmentBreakdown().subtitle}
                    </div>
                  </div>
                </div>
              </div>

              {paymentType === 'installment' && (
                <div className="ml-8 p-3 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Choose installment duration:</label>
                  <select
                    value={installmentDuration}
                    onChange={(e) => setInstallmentDuration(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value={2}>2 months - ₦{getInstallmentBreakdown().monthlyPayment.toLocaleString()}/month</option>
                    <option value={3}>3 months</option>
                    <option value={4}>4 months</option>
                    <option value={5}>5 months</option>
                    <option value={6}>6 months</option>
                  </select>
                  <div className="text-sm text-blue-700 mt-2 space-y-1">
                    <p>• Down payment today: ₦{getInstallmentBreakdown().downPayment.toLocaleString()}</p>
                    <p>• Remaining balance: ₦{getInstallmentBreakdown().remainingBalance.toLocaleString()}</p>
                    <p>• Monthly payment: ₦{getInstallmentBreakdown().monthlyPayment.toLocaleString()} (includes 5% service fee)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Color Options</h3>
            <div className="flex space-x-3">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`color-option w-10 h-10 rounded-lg cursor-pointer ${
                    selectedColor === color ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-lumiere-gray leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.dimensions && (
                <div>
                  <span className="font-medium">Dimensions:</span> {product.dimensions}
                </div>
              )}
              {product.material && (
                <div>
                  <span className="font-medium">Material:</span> {product.material}
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="font-medium">Weight:</span> {product.weight}
                </div>
              )}
              <div>
                <span className="font-medium">Category:</span> {product.category}
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`w-full mb-4 ${
              canAddToCart 
                ? 'bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            size="lg"
          >
            {!canAddToCart 
              ? 'Out of Stock' 
              : product.availableForPreOrder && !product.inStock
                ? 'Pre-order Now'
                : (() => {
                    const existingIndex = findExistingCartItem(
                      product.id, 
                      selectedColor || product.colors[0], 
                      paymentType, 
                      paymentType === 'installment' ? installmentDuration : undefined
                    );
                    
                    if (existingIndex !== -1) {
                      return 'Update Cart Item';
                    }
                    
                    return paymentType === 'installment' 
                      ? 'Add to Cart (Installment)'
                      : 'Add to Cart';
                  })()
            }
          </Button>

          {/* AR & Customization */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowARShowroom(true)}
              className="border-lumiere-gold text-lumiere-gold hover:bg-lumiere-gold hover:text-lumiere-black"
            >
              <Camera className="h-4 w-4 mr-2" />
              Try in AR
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCustomization(!showCustomization)}
              className="border-lumiere-gold text-lumiere-gold hover:bg-lumiere-gold hover:text-lumiere-black"
            >
              <Palette className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </div>

          {/* Share & Wishlist */}
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Add to Wishlist
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      {showCustomization && (
        <div className="mt-8">
          <CustomizationPanel 
            product={product}
            onCustomizationChange={setCustomizations}
            availableFor="both"
          />
        </div>
      )}

      {/* AR Showroom Modal */}
      <ARShowroom 
        product={product}
        isOpen={showARShowroom}
        onClose={() => setShowARShowroom(false)}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
