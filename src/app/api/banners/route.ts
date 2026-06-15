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
  try {
    const banners = await prisma.banner.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const { title, subtitle, categoryId } = await req.json();
    
    if (!title || !subtitle || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: { title, subtitle, categoryId }
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error("Create Banner Error:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const { id } = await req.json();
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  try {
    const { id, title, subtitle, categoryId } = await req.json();
    
    if (!id || !title || !subtitle || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: { title, subtitle, categoryId }
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error("Update Banner Error:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}
