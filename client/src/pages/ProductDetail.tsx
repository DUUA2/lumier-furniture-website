import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { Star, Heart, Share2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = parseInt(params?.id || "0");
  
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isRent, setIsRent] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

  const { addToCart } = useCart();

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
          <p className="text-lumier-gray">The product you're looking for doesn't exist.</p>
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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      type: isRent ? 'rent' : 'buy',
      color: selectedColor || product.colors[0]
    });
  };

  const getPrice = () => {
    if (isRent) {
      return Math.round(product.price * 0.15);
    }
    return product.price;
  };

  const getPriceLabel = () => {
    if (isRent) {
      return "/month";
    }
    const monthlyPrice = Math.round(product.price / 12);
    return ` or from ₦${monthlyPrice.toLocaleString()}/month`;
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
                  mainImage === image ? 'border-lumier-gold' : 'border-transparent hover:border-lumier-gold'
                }`}
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-lumier-gold">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <Star className="h-4 w-4" />
            </div>
            <span className="ml-2 text-sm text-lumier-gray">(24 reviews)</span>
          </div>

          {/* Rent/Buy Toggle */}
          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
              <Button
                variant={!isRent ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsRent(false)}
                className={!isRent ? "rent-buy-toggle text-white" : "text-lumier-gray"}
              >
                Buy
              </Button>
              <Button
                variant={isRent ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsRent(true)}
                className={isRent ? "rent-buy-toggle text-white" : "text-lumier-gray"}
              >
                Rent
              </Button>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">₦{getPrice().toLocaleString()}</span>
              <span className="text-lumier-gold ml-2">{getPriceLabel()}</span>
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
            <p className="text-lumier-gray leading-relaxed">{product.description}</p>
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
            className="w-full bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90 mb-4"
            size="lg"
          >
            Add to Cart
          </Button>

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
