"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  weight: string;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  liveData: Record<string, any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [liveData, setLiveData] = useState<Record<string, any>>({});

  // Load from Local Storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("seabasket_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          // Deduplicate items that have the exact same productId
          const deduplicated = parsed.reduce((acc: CartItem[], current: CartItem) => {
            const existing = acc.find(item => item.productId === current.productId);
            if (!existing) {
              return acc.concat([current]);
            } else {
              existing.quantity += current.quantity;
              return acc;
            }
          }, []);
          setItems(deduplicated);
        }
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to Local Storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("seabasket_cart", JSON.stringify(items));
      // Fetch live stock / prices
      if (items.length > 0) {
        fetch("/api/cart-validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items })
        })
          .then(res => res.json())
          .then(data => {
            if (data.liveData) setLiveData(data.liveData);
          })
          .catch(console.error);
      } else {
        setLiveData({});
      }
    }
  }, [items, isInitialized]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => {
    const live = liveData[i.productId];
    if (live === undefined) return sum + i.quantity; // before fetch
    if (live === null) return sum; // deleted
    return sum + i.quantity;
  }, 0);

  const totalPrice = items.reduce((sum, i) => {
    const live = liveData[i.productId];
    if (live === undefined) return sum + (i.price * i.quantity); // before fetch
    if (live === null) return sum; // deleted
    const effectivePrice = live.offerPrice || live.price;
    return sum + (effectivePrice * i.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
        liveData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
