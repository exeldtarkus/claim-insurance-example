// eslint-disable @typescript-eslint/no-unused-vars
import Cookies from "@/utils/CookieUtils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = Cookies.get(req, "token");

    if (!token) {
      return NextResponse.json({ message: "token not found!" }, { status: 401 });
    }

    const userData = await fetch(`${process.env.SERVICES_HOST}/api/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,

      },
    });

    const data = await userData.json();

    if (!userData.ok) {
      return NextResponse.json(data, { status: userData.status });
    }

    const res = NextResponse.json({ data: data.data });

    return res;
  } catch (error) {
    console.error("get user error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
