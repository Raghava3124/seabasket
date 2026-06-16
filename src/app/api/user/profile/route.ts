import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const session = JSON.parse(sessionCookie);
    const userId = session.userId;

    const { name, email, dob, anniversary, gender } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is mandatory" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email: email || null,
        dob: dob || null,
        anniversary: anniversary || null,
        gender: gender || null,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
