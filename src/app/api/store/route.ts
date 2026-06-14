import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const config = await prisma.storeConfig.findFirst();
    if (!config) {
      return NextResponse.json({ store: null });
    }
    return NextResponse.json({ store: config });
  } catch (error) {
    console.error("Error fetching store config:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { latitude, longitude, radiusKm, address } = await req.json();

    // Check if one exists
    const existing = await prisma.storeConfig.findFirst();

    let store;
    if (existing) {
      store = await prisma.storeConfig.update({
        where: { id: existing.id },
        data: { latitude, longitude, radiusKm, address },
      });
    } else {
      store = await prisma.storeConfig.create({
        data: { latitude, longitude, radiusKm, address },
      });
    }

    return NextResponse.json({ success: true, store });
  } catch (error) {
    console.error("Error saving store config:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
