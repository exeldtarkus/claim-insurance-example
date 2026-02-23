import { NextResponse, NextRequest } from "next/server";
import { encryptWithPrivateKey, decryptWithPrivateKey } from "@/utils/HashUtils";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const isProduction = (process.env.APP_ENV || "") === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: "lax" as "lax" | "strict" | "none",
  path: "/",
};

const FIFTEEN_MINUTES = 60 * 15;
const TWENTY_FIVE_MINUTES = 60 * 25;
const SEVEN_DAYS = 60 * 60 * 24 * 7;

class Cookies {
  static set(
    res: NextResponse,
    name: string,
    value: string,
    maxAge: number = FIFTEEN_MINUTES
  ) {
    const encryptedValue = encryptWithPrivateKey(value);
    console.info("[Cookies] - [check] - APP_ENV - ", process.env.APP_ENV);
    console.info("[Cookies] - [set] - ", JSON.stringify(COOKIE_OPTIONS));
    res.cookies.set(name, encryptedValue, {
      ...COOKIE_OPTIONS,
      maxAge,
    });

    console.info(`[Cookies] - [set] - ${name}: ${value}`);
  }

  static get(req: NextRequest, name: string): string | null {
    const encryptedValue = req.cookies.get(name)?.value;
    if (encryptedValue) {
      return decryptWithPrivateKey(encryptedValue);
    }
    return null;
  }

  static has(req: NextRequest, name: string): boolean {
    return req.cookies.has(name);
  }

  static getAll(req: NextRequest): RequestCookie[] {
    return req.cookies.getAll();
  }

  static delete(res: NextResponse, name: string) {
    res.cookies.delete(name);
  }

  static setAuthCookies(res: NextResponse, token: string, refreshToken: string) {
    this.set(res, "token", token, TWENTY_FIVE_MINUTES);
    this.set(res, "refreshToken", refreshToken, SEVEN_DAYS);
  }
}

export default Cookies;
