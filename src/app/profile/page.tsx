import AddressBook from "@/components/AddressBook";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Package } from "lucide-react";
import ProfileActions from "@/components/ProfileActions";
import OrderTracker from "@/components/OrderTracker";

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
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <AddressBook />
        </div>
      </div>
    </div>
  );
}
