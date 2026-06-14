import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const session = JSON.parse(sessionCookie);
    const body = await req.json();

    const { items, addressId, totalAmount, paymentId } = body;

    if (!items || items.length === 0 || !addressId) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        addressId,
        totalAmount,
        paymentId,
        status: "PREPARING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
