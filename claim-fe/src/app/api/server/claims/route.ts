import Cookies from "@/utils/CookieUtils";
import { decryptWithPrivateKey } from "@/utils/HashUtils";
import { NextRequest, NextResponse } from "next/server";

const logTemplate = "api/server/claims";

export async function GET(req: NextRequest) {
  console.log(`[${logTemplate}] GET - START`);
  try {
    const token = req.cookies.get("token")?.value;

    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();

    console.log(`[${logTemplate}] GET - Params: ${queryString || "None"}`);

    // Tembak FastAPI Backend
    const backendUrl = `${process.env.SERVICES_HOST}/api/claims?${queryString}`;
    console.log(`[${logTemplate}] GET - Hitting Backend: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decryptWithPrivateKey(token || "")}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    console.log(`[${logTemplate}] GET - Backend Status: ${response.status}`);

    if (!response.ok) {
      console.error(`[${logTemplate}] GET - Backend Error:`, JSON.stringify(result, null, 2));
      return NextResponse.json(result, { status: response.status });
    }

    console.log(`[${logTemplate}] GET - END (Success)`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[${logTemplate}] GET - Server Exception:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log(`[${logTemplate}] POST - START`);
  try {
    const token = req.cookies.get("token")?.value;
    const body = await req.json();

    console.log(`[${logTemplate}] POST - Payload:`, JSON.stringify(body));

    const backendUrl = `${process.env.SERVICES_HOST}/api/claims`;
    console.log(`[${logTemplate}] POST - Hitting Backend: ${backendUrl}`);

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${decryptWithPrivateKey(token || "")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    console.log(`[${logTemplate}] POST - Backend Status: ${backendRes.status}`);

    if (!backendRes.ok) {
      console.error(`[${logTemplate}] POST - Backend Error:`, JSON.stringify(data, null, 2));
      return NextResponse.json(data, { status: backendRes.status });
    }

    console.log(`[${logTemplate}] POST - END (Success)`);
    return NextResponse.json({ data: data.data || data });

  } catch (error) {
    console.error(`[${logTemplate}] POST - Server Exception:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
