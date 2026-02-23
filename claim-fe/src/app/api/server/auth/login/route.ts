import { ILoginServicesPayload } from "@/interfaces/IAuthLoginService";
import Cookies from "@/utils/CookieUtils";
import { NextRequest, NextResponse } from "next/server";

const logTemplate = "[api/server/auth/login] - ";

export async function POST(req: NextRequest) {
  try {
    console.info(logTemplate, "START");
    const body: ILoginServicesPayload = await req.json();
    // const FIFTEEN_MINUTES = 60 * 15;
    const TWENTY_FIVE_MINUTES = 60 * 25;
    const SEVEN_DAYS = 60 * 60 * 24 * 7;

    const backendRes = await fetch(`${process.env.SERVICES_HOST}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: body.username, password: body.password}),
    });

    const data = await backendRes.json();

    console.log(`${process.env.SERVICES_HOST}/api/auth/login - ${JSON.stringify(body)}`, " - LOGIN - data -", data);

    if (!backendRes.ok) {
      console.error(logTemplate, "login Failed - ", backendRes.status);
      console.info(logTemplate, "END");
      return NextResponse.json(data, { status: backendRes.status });
    }

    const res = NextResponse.json({ message: "Login success" });
    const responseData = data.data;

    console.log("responseData -", responseData);

    console.info(logTemplate, "set token, refresh token, rememberMe");
    Cookies.set(res, "token", responseData.token, SEVEN_DAYS);

    console.info(logTemplate, "login success");
    console.info(logTemplate, "END");

    return res;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
