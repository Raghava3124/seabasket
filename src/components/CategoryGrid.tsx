import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  if (categories.length === 0) return null;

  return (
    <div className="container mx-auto px-4 lg:px-8 mt-12 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">Shop by Category</h2>
      <div className="flex overflow-x-auto pb-4 gap-4 lg:gap-8 snap-x scrollbar-hide">
        {categories.map((cat) => (
          <Link href={`/category/${cat.slug}`} key={cat.id} className="flex flex-col items-center group flex-shrink-0 snap-start">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-transparent group-hover:border-brand/20 flex items-center justify-center mb-3 group-hover:shadow-md transition-all overflow-hidden bg-gray-50">
               {cat.imageUrl ? (
                 <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
               ) : (
                 <span className="text-3xl opacity-50">🐟</span>
               )}
            </div>
            <span className="text-sm md:text-base font-semibold text-gray-800 text-center group-hover:text-brand transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
