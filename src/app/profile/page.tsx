import AddressBook from "@/components/AddressBook";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Package } from "lucide-react";
import ProfileActions from "@/components/ProfileActions";
import ProfileForm from "@/components/ProfileForm";

export const revalidate = 0; // Dynamic route

export default async function ProfilePage() {
  const sessionCookie = cookies().get("session")?.value;
  
  if (!sessionCookie) {
    redirect("/");
  }

  const session = JSON.parse(sessionCookie);

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Profile</h1>
            <p className="text-gray-500 mt-1">Manage your personal details and delivery addresses</p>
          </div>
          <ProfileActions role={session.role} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <ProfileForm user={user} />
          </div>
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
              <AddressBook />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
