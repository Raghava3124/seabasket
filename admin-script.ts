import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const phone = "6300073279"; // The user's phone number
  const updated = await prisma.user.updateMany({
    where: { phone },
    data: { role: "ADMIN" }
  });
  console.log(`Updated ${updated.count} users to ADMIN role.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
