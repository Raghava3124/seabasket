import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = JSON.parse(sessionCookie);

    const address = await prisma.address.findUnique({ where: { id: params.id } });
    if (!address || address.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.address.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = JSON.parse(sessionCookie);
    const body = await req.json();

    const address = await prisma.address.findUnique({ where: { id: params.id } });
    if (!address || address.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.address.update({
      where: { id: params.id },
      data: {
        type: body.type,
        receiverName: body.receiverName,
        receiverPhone: body.receiverPhone,
        flat: body.flat,
        street: body.street,
        area: body.area,
        pincode: body.pincode,
        latitude: body.latitude,
        longitude: body.longitude,
      }
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
