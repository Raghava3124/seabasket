"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag, Plus, Minus } from "lucide-react";

interface AddToCartDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    netWeight: string | null;
  };
}

export default function AddToCartDetail({ product }: AddToCartDetailProps) {
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find((i) => i.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  if (quantity > 0) {
    return (
      <div className="flex items-center gap-6 w-full max-w-xs h-14 bg-brand/10 border border-brand/20 rounded-xl px-4">
        <button 
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className="text-brand hover:bg-brand/20 p-2 rounded-full transition-colors flex-shrink-0"
        >
          <Minus className="h-6 w-6" />
        </button>
        <span className="text-xl font-black w-full text-center text-brand">{quantity} in Cart</span>
        <button 
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="text-brand hover:bg-brand/20 p-2 rounded-full transition-colors flex-shrink-0"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        weight: product.netWeight || "500g",
      })}
      className="w-full max-w-xs h-14 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-3 text-lg"
    >
      <ShoppingBag className="h-5 w-5" />
      ADD TO CART
    </button>
  );
}
