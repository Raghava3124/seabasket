"use client";

import { useEffect, useState } from "react";
import { Truck, MapPin, CheckCircle2, PhoneCall, Loader2, Navigation } from "lucide-react";

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/delivery/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/delivery/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status })
      });
      if (res.ok) fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand h-8 w-8" /></div>;

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <div className="bg-brand text-white py-6 shadow-md rounded-b-3xl">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Truck className="h-6 w-6" />
              Agent App
            </h1>
            <p className="text-brand-light text-sm mt-1">Live Delivery Queue</p>
          </div>
          <div className="bg-white/20 h-10 w-10 flex items-center justify-center rounded-full">
            <span className="font-bold">{orders.length}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-lg">No active deliveries.</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              {/* Status Header */}
              <div className={`px-4 py-3 border-b flex items-center justify-between ${
                order.status === 'PREPARING' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'
              }`}>
                <span className="font-bold text-gray-900">#{order.id.slice(-6).toUpperCase()}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  order.status === 'PREPARING' ? 'bg-orange-200 text-orange-800' : 'bg-blue-200 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Order Details */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">{order.address.flat}, {order.address.street}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{order.address.area}, {order.address.pincode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="bg-brand/10 p-2 rounded-full">
                    <PhoneCall className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{order.user.name || "Customer"}</p>
                    <p className="text-gray-500 text-sm">+91 {order.user.phone}</p>
                  </div>
                </div>

                {/* Actions */}
                {order.status === 'PREPARING' ? (
                  <button 
                    onClick={() => updateStatus(order.id, 'DISPATCHED')}
                    className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand/20"
                  >
                    <Truck className="h-5 w-5" />
                    Accept & Dispatch
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      <Navigation className="h-5 w-5" />
                      Navigate
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'DELIVERED')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Delivered
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
