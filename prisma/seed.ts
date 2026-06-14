import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean up
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("Deleted old data...");

  // Categories
  const categoriesData = [
    { name: "Fresh Fish", slug: "fish", imageUrl: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=500&q=80" },
    { name: "Premium Prawns", slug: "prawns", imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&q=80" },
    { name: "Crabs & Lobsters", slug: "crabs", imageUrl: "https://images.unsplash.com/photo-1559841644-08984562005a?w=500&q=80" },
    { name: "Squid & Octopus", slug: "squid", imageUrl: "https://images.unsplash.com/photo-1626082929543-edbf29d20c38?w=500&q=80" },
    { name: "Exotic Catch", slug: "exotic", imageUrl: "https://images.unsplash.com/photo-1521571520638-b349d91a92e1?w=500&q=80" },
    { name: "Value Combos", slug: "combos", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80" }
  ];

  const categories = await Promise.all(
    categoriesData.map(c => prisma.category.create({ data: c }))
  );

  console.log("Categories seeded!");

  // Find IDs
  const fishId = categories.find(c => c.slug === "fish")!.id;
  const prawnsId = categories.find(c => c.slug === "prawns")!.id;
  const crabsId = categories.find(c => c.slug === "crabs")!.id;

  // Products
  const productsData = [
    {
      categoryId: fishId,
      name: "Premium Rohu (Rui) - Medium Cuts",
      description: "Freshwater Rohu, perfectly cut and cleaned. Ideal for traditional curries. Sourced locally.",
      price: 349,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1596796335191-23d9229f61b0?w=500&q=80",
      grossWeight: "650g",
      netWeight: "500g",
      isBestseller: true,
    },
    {
      categoryId: fishId,
      name: "Seer Fish (Surmai) - Steaks",
      description: "King Mackerel steaks, bone-in. Packed with omega-3 and great for pan-frying.",
      price: 999,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1611599537845-1c7cea39c74c?w=500&q=80",
      grossWeight: "500g",
      netWeight: "500g",
      isBestseller: true,
    },
    {
      categoryId: prawnsId,
      name: "Tiger Prawns - Extra Large (Cleaned & Deveined)",
      description: "Juicy, sweet, and perfectly cleaned Tiger Prawns. No shells, no veins. Ready to cook.",
      price: 749,
      stock: 100,
      imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&q=80",
      grossWeight: "400g",
      netWeight: "250g",
      isBestseller: true,
    },
    {
      categoryId: crabsId,
      name: "Live Mud Crabs (Large)",
      description: "Fresh, live mud crabs packed with sweet, tender meat. Perfect for spicy crab masala.",
      price: 899,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1559841644-08984562005a?w=500&q=80",
      grossWeight: "1kg",
      netWeight: "800g",
      isBestseller: false,
    }
  ];

  await Promise.all(productsData.map(p => prisma.product.create({ data: p })));

  console.log("Products seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
