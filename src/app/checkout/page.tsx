"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { MapPin, ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AddressBook from "@/components/AddressBook";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, liveData } = useCart();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
      return;
    }
    fetchAddresses();
  }, [items.length]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/address");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
        const deliverableAddresses = data.addresses.filter((a: any) => a.isDeliverable !== false);
        if (deliverableAddresses.length > 0) {
          setSelectedAddress(deliverableAddresses[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const validItems = items.map(item => {
    const live = liveData[item.productId];
    if (live === null) return null; // deleted
    if (live) {
      const maxQty = live.netWeightGrams ? Math.floor(live.stock / live.netWeightGrams) : live.stock;
      if (maxQty <= 0) return null; // out of stock
      const effectivePrice = live.offerPrice || live.price;
      return { ...item, quantity: Math.min(item.quantity, maxQty), price: effectivePrice };
    }
    return item; // fallback if not loaded yet
  }).filter(Boolean) as any[];

  const hasDroppedItems = items.length > 0 && validItems.length < items.length;

  const handlePaymentMock = async () => {
    if (!selectedAddress || validItems.length === 0) return;
    setProcessing(true);
    
    // Auto-confirm for testing purposes
    toast.success("Payments have been confirmed for testing purposes.", { duration: 4000 });
    
    // Simulate slight network delay
    await new Promise(r => setTimeout(r, 1000));
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: validItems.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
          addressId: selectedAddress,
          totalAmount: totalPrice,
          paymentId: `pay_${Math.random().toString(36).substring(7)}`,
        }),
      });

      if (res.ok) {
        clearCart();
        router.push("/profile");
      }
    } catch (e) {
      console.error(e);
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand h-8 w-8" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-5xl">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Addresses */}
          <div className="lg:col-span-2 space-y-8">
            <AddressBook 
              selectionMode={true} 
              selectedId={selectedAddress} 
              onSelect={setSelectedAddress} 
              title="Select Delivery Address"
              onAddressesLoaded={(addrs) => {
                setAddresses(addrs);
                if(!selectedAddress) {
                  const deliverable = addrs.filter(a => a.isDeliverable !== false);
                  if (deliverable.length > 0) setSelectedAddress(deliverable[0].id);
                }
              }} 
            />
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {hasDroppedItems && (
                <div className="bg-orange-50 text-orange-700 p-3 rounded-lg text-xs font-medium mb-4">
                  Some items in your cart are no longer available and have been removed.
                </div>
              )}

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {validItems.map(item => (
                  <div key={item.productId} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900 leading-tight">{item.name}</p>
                      <p className="text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100 mt-2">
                  <span>Total To Pay</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              <button 
                disabled={!selectedAddress || validItems.length === 0 || processing}
                onClick={handlePaymentMock}
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : validItems.length === 0 ? "Cart is empty" : "Proceed to Pay"}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                Secure 128-bit SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
