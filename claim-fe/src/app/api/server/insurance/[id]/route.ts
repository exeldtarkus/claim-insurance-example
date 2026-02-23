import { decryptWithPrivateKey } from "@/utils/HashUtils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Definisi params sebagai Promise
) {
  try {
    const token = req.cookies.get("token")?.value;

    // FIX 1: Await params sesuai standar Next.js 15
    const { id: insuranceId } = await params;

    console.log("DEBUG: insuranceId detected ->", insuranceId);

    if (!insuranceId) {
      return NextResponse.json({ message: "ID asuransi tidak ditemukan" }, { status: 400 });
    }

    const backendUrl = `${process.env.SERVICES_HOST}/api/insurance/${insuranceId}`;

    const insurance = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decryptWithPrivateKey(token || "")}`,
        "Content-Type": "application/json",
      },
    });

    const data = await insurance.json();

    if (!insurance.ok) {
      console.error("DEBUG: Backend Error ->", data);
      return NextResponse.json(data, { status: insurance.status });
    }

    return NextResponse.json({ data: data.data || data });

  } catch (error) {
    console.error("Server Route Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
