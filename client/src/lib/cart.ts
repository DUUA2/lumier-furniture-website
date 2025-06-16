export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'buy' | 'rent';
  color: string;
}

export const getCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem('lumierCart');
    const parsedCart = cart ? JSON.parse(cart) : [];
    console.log('Retrieved cart from localStorage:', parsedCart);
    return parsedCart;
  } catch (error) {
    console.error('Error retrieving cart from localStorage:', error);
    return [];
  }
};

export const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    console.log('Saving cart to localStorage:', cart);
    localStorage.setItem('lumierCart', JSON.stringify(cart));
    console.log('Cart saved successfully');
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

export const addToCart = (item: CartItem, existingCart: CartItem[]): CartItem[] => {
  const existingItem = existingCart.find(cartItem => 
    cartItem.id === item.id && 
    cartItem.type === item.type && 
    cartItem.color === item.color
  );

  if (existingItem) {
    return existingCart.map(cartItem =>
      cartItem.id === item.id && 
      cartItem.type === item.type && 
      cartItem.color === item.color
        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
        : cartItem
    );
  }

  return [...existingCart, item];
};

export const updateCartItemQuantity = (
  index: number, 
  quantity: number, 
  cart: CartItem[]
): CartItem[] => {
  if (quantity <= 0) {
    return cart.filter((_, i) => i !== index);
  }

  return cart.map((item, i) => 
    i === index ? { ...item, quantity } : item
  );
};

export const removeFromCart = (index: number, cart: CartItem[]): CartItem[] => {
  return cart.filter((_, i) => i !== index);
};
