import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return NextResponse.json({ user: null });
  
  const session = JSON.parse(sessionCookie);
  return NextResponse.json({ user: session });
}
