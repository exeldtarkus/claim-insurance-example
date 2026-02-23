import Cookies from "@/utils/CookieUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ) {
  try {
    const refreshToken = Cookies.get(req, "refreshToken");
    console.log("checkkk token - ", refreshToken);

    if (!refreshToken) {
      return NextResponse.json({ message: "Refresh token missing" }, { status: 401 });
    }

    const refreshRes = await fetch(`${process.env.SERVICES_HOST}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await refreshRes.json();

    if (!refreshRes.ok) {
      return NextResponse.json(data, { status: refreshRes.status });
    }

    const res = NextResponse.json({ message: "Token refreshed" });

    res.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    return res;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
