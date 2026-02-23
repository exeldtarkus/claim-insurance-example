import Cookies from "@/utils/CookieUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = Cookies.get(req, "token");

    const insurance = await fetch(`${process.env.SERVICES_HOST}/api/insurance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await insurance.json();

    if (!insurance.ok) {
      return NextResponse.json(data, { status: insurance.status });
    }

    const res = NextResponse.json({ data: data.data });

    return res;
  } catch (error) {
    console.error("get user error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
