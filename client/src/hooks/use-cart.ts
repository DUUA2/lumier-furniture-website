import { useState, useEffect, useCallback } from 'react';
import { CartItem, getCartFromStorage, saveCartToStorage, addToCart as addItemToCart, updateCartItemQuantity, removeFromCart as removeItemFromCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getCartFromStorage());
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (cart.length >= 0) {
      saveCartToStorage(cart);
    }
  }, [cart]);

  const addToCart = useCallback((item: CartItem) => {
    setCart(currentCart => {
      const newCart = addItemToCart(item, currentCart);
      return newCart;
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  }, [toast]);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setCart(currentCart => updateCartItemQuantity(index, quantity, currentCart));
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart(currentCart => {
      const removedItem = currentCart[index];
      const newCart = removeItemFromCart(index, currentCart);
      if (removedItem) {
        toast({
          title: "Removed from cart",
          description: `${removedItem.name} has been removed from your cart.`,
        });
      }
      return newCart;
    });
  }, [toast]);

  const clearCart = useCallback(() => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  }, [toast]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const getCartItemsCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };
}
