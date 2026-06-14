"use client";

import { useCart } from "@/context/CartContext";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    grossWeight: string | null;
    netWeight: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItem = items.find((i) => i.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      weight: product.netWeight || "500g",
    });
  };

  const handleIncrement = () => updateQuantity(product.id, quantity + 1);
  const handleDecrement = () => updateQuantity(product.id, quantity - 1);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group flex flex-col h-full">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden block">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Delivery Time Badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
          <span>⏱ 90 mins</span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-1 leading-tight hover:text-brand transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
        
        <div className="mt-auto">
          {product.grossWeight && product.netWeight && (
            <div className="flex gap-3 mb-4">
              <div className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                Gross: {product.grossWeight}
              </div>
              <div className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                Net: {product.netWeight}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-lg text-brand leading-none">₹{product.price}</span>
            </div>
            
            {quantity === 0 ? (
              <button 
                onClick={handleAdd}
                className="bg-brand hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md transition-colors shadow-sm"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-brand/10 border border-brand/20 rounded-md px-2 py-1">
                <button 
                  onClick={handleDecrement}
                  className="text-brand font-bold hover:bg-brand/20 p-1 rounded"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold w-4 text-center text-brand">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="text-brand font-bold hover:bg-brand/20 p-1 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
