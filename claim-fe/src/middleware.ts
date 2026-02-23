import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "./utils/CookieUtils";
import validLoginHelper from "./helpers/ValidLoginHelper";

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const logTemplate = `[middleware] - [path: ${pathname}]`;

  console.info(`${logTemplate} - Start`);
  console.info(`${logTemplate} - Pathname: ${pathname}`);
  console.info(`${logTemplate} - Full URL: ${req.url}`);

  const cookieToken = Cookies.get(req, "token") || "";
  const cookieRefreshToken = Cookies.get(req, "refreshToken") || "";
  const cookieRememberMe = Cookies.get(req, "rememberMe") || "false";
  const tokenIsActive = cookieToken !== "" ? true : false;

  const baseUrl = process.env.NEXTAUTH_URL || "http://8.215.197.177:3124";
  const nextResponse = NextResponse.next();
  const logoutRedirect = NextResponse.redirect(`${baseUrl}/api/server/auth/logout?redirect=/signin`);

  console.info(`${logTemplate} - NEXTAUTH_URL - ${baseUrl}`);
  console.info(`${logTemplate} - Cookie Token - ${cookieToken}`);
  console.info(`${logTemplate} - Cookie Refresh Token - ${cookieRefreshToken}`);
  console.info(`${logTemplate} - Remember Me - ${cookieRememberMe}`);
  console.info(`${logTemplate} - [tokenIsActive] - ${tokenIsActive}`);
  console.info(`${logTemplate} - All cookies in middleware:`, JSON.stringify(req.cookies.getAll()));

  const excludedPaths = [
    "/api/server/auth/login",
    "/api/server/auth/logout",
    "/api/server/auth/refresh-token",
  ];

  if (excludedPaths.some((excluded) => pathname.startsWith(excluded))) {
    console.info(`${logTemplate} - Path excluded from auth middleware`);
    console.info(`${logTemplate} - End`);
    return nextResponse;
  }

  if (tokenIsActive === false) {
    const checkLogin = await validLoginHelper({
      nextBaseUrl: baseUrl,
      accessToken: cookieToken,
      refreshToken: cookieRefreshToken,
      rememberMe: cookieRememberMe,
      logTemplate: logTemplate,
    });

    console.info(logTemplate, "- check login - ", JSON.stringify(checkLogin));

    if (!checkLogin.isValid) {
      if (pathname.startsWith("/signin")) {
        console.info(`${logTemplate} - [checkLogin is Not Valid] - return nextResponse: `, nextResponse);
        console.info(`${logTemplate} - End`);
        return nextResponse;
      }
      console.info(`${logTemplate} - [checkLogin is Not Valid] - return logoutRedirect: `, logoutRedirect);
      console.info(`${logTemplate} - End`);
      return logoutRedirect;
    }

    if (checkLogin.newAccessToken) {
      Cookies.delete(nextResponse, "token");
      console.warn(`${logTemplate} - delete - cookie token!`);
      Cookies.set(nextResponse, "token", checkLogin.newAccessToken, 60 * 15);
      console.info(`${logTemplate} - Set new Access Token`);
    }
  }

  if (pathname.startsWith("/signin")) {
    console.info(`${logTemplate} - token is active for page in /signin, redirect [NextResponse.redirect(baseUrl)] to ${baseUrl}`);
    console.info(`${logTemplate} - End`);
    return NextResponse.redirect(baseUrl);
  }

  return nextResponse;

};

export const config = {
  matcher: [
    "/",
    "/signin",
    "/review-data",
    "/validation-progress",
    "/validation-progress/p1/period/:period/segment/:segment",
    "/api/server/:path*",
    "/upload-response",
    "/history-validation",
  ],
};
