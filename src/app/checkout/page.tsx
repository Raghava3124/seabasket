"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { MapPin, ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AddressBook from "@/components/AddressBook";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
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
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMock = async () => {
    if (!selectedAddress) return;
    setProcessing(true);
    
    // Simulate network delay for Razorpay processing
    await new Promise(r => setTimeout(r, 2000));
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
          addressId: selectedAddress,
          totalAmount: totalPrice,
          paymentId: `pay_${Math.random().toString(36).substring(7)}`,
        }),
      });

      if (res.ok) {
        clearCart();
        setShowRazorpay(false);
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
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand" />
                Select Delivery Address
              </h2>
              
              {addresses.length === 0 ? (
                <div>
                  <p className="text-gray-500 mb-4">You have no saved addresses.</p>
                  <AddressBook />
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-brand bg-brand/5 ring-1 ring-brand' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr.id} 
                        checked={selectedAddress === addr.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1 text-brand focus:ring-brand"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{addr.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.flat}, {addr.street}, {addr.area}, Pincode: {addr.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                  <div className="pt-4 border-t border-gray-100">
                     <p className="text-sm text-gray-500 font-medium mb-2">Need to deliver somewhere else?</p>
                     <AddressBook />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
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
                disabled={!selectedAddress}
                onClick={() => setShowRazorpay(true)}
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Pay
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                Secure 128-bit SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Razorpay Modal */}
      {showRazorpay && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B3B60] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="font-bold">Razorpay Mock UI</span>
              </div>
              <span className="font-black text-xl">₹{totalPrice}</span>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6 text-center">
                This is a mock payment gateway since Razorpay keys are not provided.
              </p>
              <button 
                onClick={handlePaymentMock}
                disabled={processing}
                className="w-full bg-[#0B3B60] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#07243c] transition-colors"
              >
                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Simulate Successful Payment"}
              </button>
              <button 
                onClick={() => setShowRazorpay(false)}
                disabled={processing}
                className="w-full mt-3 text-gray-500 font-semibold py-2 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
