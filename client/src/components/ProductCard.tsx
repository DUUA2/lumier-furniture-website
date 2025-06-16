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
        <p className="text-lumier-gray text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold">₦{product.price.toLocaleString()}</span>
          <span className="text-sm text-lumier-gold">From ₦{monthlyPrice.toLocaleString()}/month</span>
        </div>
        <Badge variant="secondary" className="mb-3">
          {product.category}
        </Badge>
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
        <Button
          onClick={handleAddToCart}
          className="w-full bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90"
        >
          Add {quantity} to Cart
        </Button>
      </div>
    </div>
  );
}
