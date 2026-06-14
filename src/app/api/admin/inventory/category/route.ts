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
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const { name, slug, imageUrl } = await req.json();
    
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, slug, imageUrl }
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A category with this name or slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const { id } = await req.json();
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const { id, name, slug, imageUrl } = await req.json();
    
    if (!id || !name || !slug) {
      return NextResponse.json({ error: "ID, Name and Slug are required" }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, imageUrl }
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}
