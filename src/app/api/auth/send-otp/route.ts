import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with an expiration of 5 minutes
    await redis.setex(`otp:${phone}`, 300, otp);

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && accountSid !== "your_twilio_account_sid_here") {
      const client = twilio(accountSid, authToken);
      await client.messages.create({
        body: `Your SeaBasket login OTP is ${otp}. It is valid for 5 minutes.`,
        from: twilioPhone,
        to: `+91${phone}`
      });
      console.log(`[TWILIO SMS] Sent OTP to +91 ${phone}`);
    } else {
      console.log(`[MOCK SMS] Sent OTP ${otp} to +91 ${phone} (Twilio not configured)`);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("OTP Send Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
