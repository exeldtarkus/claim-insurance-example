import Cookies from "@/utils/CookieUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = Cookies.get(req, "token");

    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 401 });
    }

    const verifyRes = await fetch(`${process.env.SERVICES_HOST}/api/auth/token/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,

      },
    });

    const data = await verifyRes.json();

    return NextResponse.json(data, { status: verifyRes.status });
  } catch (error) {
    console.error("Verify token error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
