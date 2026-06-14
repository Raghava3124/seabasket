import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    const storedOtp = await redis.get(`otp:${phone}`);

    if (!storedOtp) {
      return NextResponse.json({ error: "OTP expired or not requested" }, { status: 400 });
    }

    if (storedOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP is valid. Clear it.
    await redis.del(`otp:${phone}`);

    // Upsert User
    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone },
    });

    // Create a mock session cookie
    cookies().set("session", JSON.stringify({ userId: user.id, phone: user.phone, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("OTP Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
