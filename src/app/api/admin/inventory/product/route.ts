import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function isAdmin() {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return false;
  try {
    const session = JSON.parse(sessionCookie);
    return session.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const body = await req.json();
    const { categoryId, name, description, price, offerPrice, stock, stockUnit, lowStockThreshold, imageUrl, grossWeight, netWeight, isBestseller } = body;
    
    if (!categoryId || !name || !price || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert stock based on unit
    let finalStock = parseInt(stock, 10) || 0;
    if (stockUnit === "kg") {
      finalStock = finalStock * 1000;
    }

    // Parse net weight strictly to grams (assuming admin writes it correctly or we parse digits)
    let parsedNetWeightGrams = 0;
    if (netWeight) {
      const match = netWeight.match(/(\d+(\.\d+)?)/);
      if (match) {
        let val = parseFloat(match[1]);
        if (netWeight.toLowerCase().includes("kg")) {
          val = val * 1000;
        }
        parsedNetWeightGrams = Math.round(val);
      }
    }

    const product = await prisma.product.create({
      data: {
        categoryId,
        name,
        description,
        price: parseFloat(price),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        stock: finalStock,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 5000,
        imageUrl,
        grossWeight,
        netWeight,
        netWeightGrams: parsedNetWeightGrams,
        isBestseller: Boolean(isBestseller)
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const { id } = await req.json();
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, categoryId, name, description, price, offerPrice, stock, stockUnit, lowStockThreshold, imageUrl, grossWeight, netWeight, isBestseller } = body;
    
    if (!id || !categoryId || !name || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert stock based on unit
    let finalStock = parseInt(stock, 10) || 0;
    if (stockUnit === "kg") {
      finalStock = finalStock * 1000;
    }

    // Parse net weight strictly to grams
    let parsedNetWeightGrams = 0;
    if (netWeight) {
      const match = netWeight.match(/(\d+(\.\d+)?)/);
      if (match) {
        let val = parseFloat(match[1]);
        if (netWeight.toLowerCase().includes("kg")) {
          val = val * 1000;
        }
        parsedNetWeightGrams = Math.round(val);
      }
    }

    const data: any = {
      categoryId,
      name,
      description,
      price: parseFloat(price),
      offerPrice: offerPrice ? parseFloat(offerPrice) : null,
      stock: finalStock,
      lowStockThreshold: parseInt(lowStockThreshold, 10) || 5000,
      grossWeight,
      netWeight,
      netWeightGrams: parsedNetWeightGrams,
      isBestseller: Boolean(isBestseller)
    };

    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    const product = await prisma.product.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
