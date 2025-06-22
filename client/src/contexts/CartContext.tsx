import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, getCartFromStorage, saveCartToStorage, addToCart as addItemToCart, updateCartItemQuantity, removeFromCart as removeItemFromCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (item: CartItem) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  findExistingCartItem: (productId: number, color: string, paymentType?: string, installmentDuration?: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const storedCart = getCartFromStorage();
    setCart(storedCart);
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever cart changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(cart);
    }
  }, [cart, isInitialized]);

  const findExistingCartItem = useCallback((productId: number, color: string, paymentType?: string, installmentDuration?: number) => {
    return cart.findIndex(item => 
      item.id === productId && 
      item.color === color &&
      item.paymentType === paymentType &&
      item.installmentDuration === installmentDuration
    );
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

  const updateCartItem = useCallback((item: CartItem) => {
    const existingIndex = findExistingCartItem(item.id, item.color, item.paymentType, item.installmentDuration);
    
    if (existingIndex !== -1) {
      setCart(currentCart => {
        const newCart = [...currentCart];
        newCart[existingIndex] = { ...item, quantity: newCart[existingIndex].quantity };
        return newCart;
      });
      toast({
        title: "Cart updated",
        description: `${item.name} configuration has been updated.`,
      });
    } else {
      addToCart(item);
    }
  }, [findExistingCartItem, addToCart, toast]);

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

  const value: CartContextType = {
    cart,
    addToCart,
    updateCartItem,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    findExistingCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}