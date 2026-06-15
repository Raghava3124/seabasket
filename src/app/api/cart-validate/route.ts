import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const productIds = items.map((i: any) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, offerPrice: true, stock: true, netWeightGrams: true }
    });

    const liveData: Record<string, any> = {};
    for (const id of productIds) {
      const p = products.find(prod => prod.id === id);
      liveData[id] = p || null;
    }

    return NextResponse.json({ liveData });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
