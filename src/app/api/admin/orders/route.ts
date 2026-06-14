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
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
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
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

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
