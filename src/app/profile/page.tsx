import AddressBook from "@/components/AddressBook";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Package } from "lucide-react";
import ProfileActions from "@/components/ProfileActions";

export const revalidate = 0; // Dynamic route

export default async function ProfilePage() {
  const sessionCookie = cookies().get("session")?.value;
  
  if (!sessionCookie) {
    redirect("/");
  }

  const session = JSON.parse(sessionCookie);

  // Fetch Orders
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
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Profile</h1>
        <p className="text-gray-500 mb-4">Logged in as +91 {session.phone}</p>
        <ProfileActions role={session.role} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AddressBook />
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="h-5 w-5 text-brand" />
              My Orders
            </h2>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Order #{order.id.slice(-6).toUpperCase()}</span>
                        <span className="text-sm font-bold text-gray-900">₹{order.totalAmount}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PREPARING' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600 line-clamp-1">{item.quantity}x {item.product.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
