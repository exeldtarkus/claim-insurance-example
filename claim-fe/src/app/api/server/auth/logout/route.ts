/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Cookies from "@/utils/CookieUtils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const logTemplate = "[api/server/auth/logout]";

export async function POST(req: NextRequest) {
  console.info(`${logTemplate} - [POST] - START`);
  const res = NextResponse.json({ message: "Logout success" });

  ["token", "refreshToken", "userData", "rememberMe"].forEach((cookie) => {
    console.info(`${logTemplate} - [set cookie] - ${cookie}: null`);
    Cookies.set(res, cookie, "", 0);
  });

  console.info(`${logTemplate} - [POST] - END`);
  return res;
}

export async function GET(req: NextRequest) {
  console.info(`${logTemplate} - [GET] - START`);
  const redirectTo = req.nextUrl.searchParams.get("redirect") || "/signin";
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:8000";

  const safeRedirect =
    redirectTo.startsWith("/") ? redirectTo : "/signin";

  const redirectUrl = `${baseUrl}${safeRedirect}`;

  const res = NextResponse.redirect(redirectUrl);

  console.log(`${logTemplate} - redirectUrl - `, redirectUrl);
  console.log(`${logTemplate} - res - `, res);

  ["token", "refreshToken", "userData", "rememberMe"].forEach((cookie) => {
    console.info(`${logTemplate} - [set cookie] - ${cookie}: null`);
    Cookies.set(res, cookie, "", 0);
  });


  console.info(`${logTemplate} - [GET] - END`);
  return res;
}
