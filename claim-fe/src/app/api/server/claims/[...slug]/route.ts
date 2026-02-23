import { decryptWithPrivateKey } from "@/utils/HashUtils";
import { NextRequest, NextResponse } from "next/server";

const logTemplate = "api/server/claims/[...slug]";

/**
 * PROXY HELPER
 * Menjembatani request dari Next.js ke FastAPI Backend
 */
async function proxyRequest(req: NextRequest, targetPath: string, method: string) {
  try {
    const token = req.cookies.get("token")?.value;
    const backendUrl = `${process.env.SERVICES_HOST}/api/claims${targetPath}`;

    let body = null;

    // Parsing body untuk method selain GET/DELETE
    if (method !== "GET" && method !== "DELETE") {
      try {
        const contentType = req.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          body = await req.json();
        }
      } catch (parseError) {
        body = null;
      }
    }

    console.log(`[${logTemplate}] ${method} - Hitting Backend: ${backendUrl}`);
    if (body) console.log(`[${logTemplate}] ${method} - Payload:`, JSON.stringify(body));

    const response = await fetch(backendUrl, {
      method: method,
      headers: {
        Authorization: `Bearer ${decryptWithPrivateKey(token || "")}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    const result = await response.json();
    console.log(`[${logTemplate}] ${method} - Backend Response Status: ${response.status}`);

    if (!response.ok) {
      console.error(`[${logTemplate}] ${method} - Backend Error:`, JSON.stringify(result, null, 2));
      return NextResponse.json(result, { status: response.status });
    }

    console.log(`[${logTemplate}] ${method} - END (Success)`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[${logTemplate}] ${method} - PROXY EXCEPTION:`, error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada Proxy Server" },
      { status: 500 }
    );
  }
}

// ========================================================
// HANDLERS
// ========================================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const id = slug[0];

  console.log(`[${logTemplate}] GET Detail - START | ID: ${id}`);
  return proxyRequest(req, `/${id}`, "GET");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const [action, id] = slug;

  console.log(`[${logTemplate}] PUT Action - START | Action: ${action}, ID: ${id}`);
  return proxyRequest(req, `/${id}/${action}`, "PUT");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const [action, id] = slug;

  console.log(`[${logTemplate}] POST Action - START | Action: ${action}, ID: ${id}`);

  // Mapping ke backend: /api/claims/{id}/{action}
  return proxyRequest(req, `/${id}/${action}`, "POST");
}
