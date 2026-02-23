import { IUpdatePasswordPayload } from "@/interfaces/IAuthLoginService";
import Cookies from "@/utils/CookieUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = Cookies.get(req, "token");
    const body: IUpdatePasswordPayload = await req.json();

    if (!token) {
      return NextResponse.json({ message: "token not found!" }, { status: 401 });
    }

    const findUser = await fetch(`${process.env.SERVICES_HOST}/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,

      },
    });

    const findUserData = await findUser.json();
    const userDefaultPassword = findUserData.data.useDefaultPassword;

    if (userDefaultPassword) {
      body.password = "sis123";
    }


    console.log("update - password - body", body);

    const backendRes = await fetch(`${process.env.SERVICES_HOST}/api/auth/update-password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",

      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json({ message: "updated password success"}, {status: 200});
  } catch (error) {
    console.error("update password route error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
