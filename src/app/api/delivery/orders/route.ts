import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function isAgent() {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return false;
  try {
    const session = JSON.parse(sessionCookie);
    return session.role === "AGENT" || session.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function GET() {
  if (!isAgent()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const orders = await prisma.order.findMany({
      where: { status: { in: ["PREPARING", "DISPATCHED"] } },
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
        address: true,
        items: { include: { product: true } }
      }
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isAgent()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const { orderId, status } = await req.json();
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
