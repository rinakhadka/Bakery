import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'sweet_crumbs_cart_v1';
const FREE_DELIVERY_THRESHOLD = 1000;
const STANDARD_DELIVERY_FEE = 100;

export function CartProvider({ children }) {
  // Load saved cart from localStorage on initial render
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  /**
   * Add item to cart with stock validation
   * Returns { success: boolean, message: string }
   */
  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].quantity;
      const newQty = currentQty + quantity;

      if (newQty > product.stock) {
        return {
          success: false,
          message: `Only ${product.stock} units of ${product.name} are available in stock.`
        };
      }

      const updated = [...cartItems];
      updated[existingIndex].quantity = newQty;
      setCartItems(updated);
      return {
        success: true,
        message: `Updated quantity for ${product.name} in cart (${newQty}).`
      };
    } else {
      if (quantity > product.stock) {
        return {
          success: false,
          message: `Only ${product.stock} units of ${product.name} are available in stock.`
        };
      }

      setCartItems([...cartItems, { ...product, quantity }]);
      return {
        success: true,
        message: `Added ${product.name} to cart!`
      };
    }
  };

  /**
   * Update item quantity directly (respects stock limit)
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const validatedQty = Math.min(newQuantity, item.stock || 99);
          return { ...item, quantity: validatedQty };
        }
        return item;
      })
    );
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee =
    subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  const totalAmount = subtotal + deliveryFee;

  const value = {
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    totalAmount,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
