import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { haversineDistance } from "@/lib/geo";

export async function GET(req: Request) {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const session = JSON.parse(sessionCookie);
    
    // Auto-heal missing user (e.g. after DB reset)
    await prisma.user.upsert({
      where: { id: session.userId },
      update: {},
      create: {
        id: session.userId,
        phone: session.phone || `mock-${Date.now()}`,
        role: session.role || "CUSTOMER"
      }
    });
    
    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' }
    });

    const storeConfig = await prisma.storeConfig.findFirst();
    
    const addressesWithStatus = addresses.map(addr => {
      let isDeliverable = true;
      if (storeConfig && addr.latitude && addr.longitude) {
        const distance = haversineDistance(storeConfig.latitude, storeConfig.longitude, addr.latitude, addr.longitude);
        isDeliverable = distance <= (storeConfig.radiusKm || 25);
      }
      return { ...addr, isDeliverable };
    });

    return NextResponse.json({ addresses: addressesWithStatus });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const session = JSON.parse(sessionCookie);
    const body = await req.json();

    // Auto-heal missing user (e.g. after DB reset)
    await prisma.user.upsert({
      where: { id: session.userId },
      update: {},
      create: {
        id: session.userId,
        phone: session.phone || `mock-${Date.now()}`,
        role: session.role || "CUSTOMER"
      }
    });

    // Calculate distance and get warning if outside bounds, but DO NOT block saving
    let warning = null;
    const storeConfig = await prisma.storeConfig.findFirst();
    if (body.latitude && body.longitude && storeConfig) {
      const distance = haversineDistance(storeConfig.latitude, storeConfig.longitude, body.latitude, body.longitude);
      if (distance > (storeConfig.radiusKm || 25)) {
        warning = `This address is outside our deliverable area (${distance.toFixed(1)}KM away). We cannot deliver here.`;
      }
    }

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        type: body.type,
        receiverName: body.receiverName,
        receiverPhone: body.receiverPhone,
        flat: body.flat,
        street: body.street,
        area: body.area,
        pincode: body.pincode,
        latitude: body.latitude,
        longitude: body.longitude,
        isDefault: false,
      }
    });

    return NextResponse.json({ address, warning });
  } catch (error: any) {
    console.error("Address error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
