import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        orderBy: { isBestseller: 'desc' }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Category Header */}
        <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6">
          {category.imageUrl && (
            <div className="w-20 h-20 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{category.name}</h1>
            <p className="text-gray-500 mt-2">{category.products.length} Items Available</p>
          </div>
        </div>

        {/* Products Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <span className="text-6xl mb-4 block">🎣</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No catches today!</h2>
            <p className="text-gray-500">We don't have any products in this category right now. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
