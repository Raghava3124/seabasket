import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch real products from DB
  const bestSellers = await prisma.product.findMany({
    where: { isBestseller: true },
    take: 8,
  });

  const valueDeals = await prisma.product.findMany({
    where: { isBestseller: false },
    take: 4,
  });

  return (
    <div className="bg-background min-h-screen">
      <HeroBanner />
      <CategoryGrid />
      
      {/* Best Sellers Section */}
      <section className="container mx-auto px-4 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Best Sellers</h2>
          <a href="/category/fish" className="text-brand font-semibold text-sm hover:underline">View All</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>

      {/* Value Deals Section */}
      {valueDeals.length > 0 && (
        <section className="container mx-auto px-4 lg:px-8 mb-16">
          <div className="bg-brand/5 rounded-2xl p-6 lg:p-8 border border-brand/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Value Deals of the Day</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {valueDeals.map((product) => (
                <ProductCard key={`deal-${product.id}`} product={product as any} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
