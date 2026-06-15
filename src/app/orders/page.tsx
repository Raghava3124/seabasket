import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Package, ArrowLeft } from "lucide-react";
import OrderTracker from "@/components/OrderTracker";
import Link from "next/link";

export const revalidate = 0; // Dynamic route

export default async function OrdersPage() {
  const sessionCookie = cookies().get("session")?.value;
  
  if (!sessionCookie) {
    redirect("/");
  }

  const session = JSON.parse(sessionCookie);

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Profile
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Package className="h-8 w-8 text-brand" />
            My Orders
          </h1>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">You haven't placed any orders yet.</p>
              <Link href="/" className="inline-block mt-4 bg-brand text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-dark transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:border-brand/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">Order #{order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-xl font-black text-gray-900">₹{order.totalAmount}</span>
                      <span className="text-xs text-gray-500 block mt-1">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PREPARING' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 border-y border-gray-100 py-4 mb-4 bg-gray-50/50 -mx-5 px-5">
                    <p className="text-xs font-bold text-gray-500 uppercase">Items Ordered</p>
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-10 h-10 rounded object-cover border border-gray-200" />
                          <span className="font-semibold text-gray-800">{item.quantity}x {item.product.name}</span>
                        </div>
                        <span className="font-bold text-gray-600">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <OrderTracker status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
