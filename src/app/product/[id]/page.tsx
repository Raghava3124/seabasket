import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartDetail from "@/components/AddToCartDetail";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true }
  });

  if (!product) return notFound();

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-12">
            
            {/* Left: Image */}
            <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full rounded-xl overflow-hidden bg-gray-100">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              <span className="text-brand font-bold text-sm uppercase tracking-wider mb-2">
                {product.category.name}
              </span>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
                {product.name}
              </h1>
              
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {product.grossWeight && (
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                    <span className="block text-xs text-gray-500 font-medium">Gross Weight</span>
                    <span className="block font-bold text-gray-900">{product.grossWeight}</span>
                  </div>
                )}
                {product.netWeight && (
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                    <span className="block text-xs text-gray-500 font-medium">Net Weight</span>
                    <span className="block font-bold text-gray-900">{product.netWeight}</span>
                  </div>
                )}
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-5xl font-black text-brand tracking-tight">₹{product.price}</span>
              </div>

              <AddToCartDetail product={product} />

              <hr className="my-10 border-gray-100" />

              {/* Guarantees */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">100% Quality Guarantee</h4>
                    <p className="text-gray-500 text-sm mt-0.5">Sourced fresh daily from local coasts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Expertly Cleaned & Cut</h4>
                    <p className="text-gray-500 text-sm mt-0.5">Ready to cook straight out of the pack.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">90 Minute Delivery</h4>
                    <p className="text-gray-500 text-sm mt-0.5">Temperature controlled express delivery.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
