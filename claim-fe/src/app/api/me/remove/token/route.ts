/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, ) {
  try {
    const res = NextResponse.json({ message: "Token refreshed" });

    res.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (error) {
    console.error("remove token error: ", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
