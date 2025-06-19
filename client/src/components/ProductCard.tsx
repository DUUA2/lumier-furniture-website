import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@shared/schema";
import { Minus, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const monthlyPrice = Math.round(product.price / 12);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      type: 'buy',
      color: Array.isArray(product.colors) ? product.colors[0] : product.colors
    });
    setQuantity(1); // Reset quantity after adding to cart
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

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover product-image-hover"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <p className="text-lumiere-gray text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold">₦{product.price.toLocaleString()}</span>
          <span className="text-sm text-lumiere-gold">From ₦{monthlyPrice.toLocaleString()}/month</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">
            {product.category}
          </Badge>
          <Badge variant={availability.variant}>
            {availability.text}
          </Badge>
          {product.availableForInstallment && (
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              Installment Available
            </Badge>
          )}
        </div>
        {canAddToCart && (
          <div className="flex items-center space-x-3 mb-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[2rem] text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className={`w-full ${
            canAddToCart 
              ? 'bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {!canAddToCart 
            ? 'Out of Stock' 
            : product.availableForPreOrder && !product.inStock
              ? `Pre-order ${quantity}`
              : `Add ${quantity} to Cart`
          }
        </Button>
      </div>
    </div>
  );
}
