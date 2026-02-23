/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryDBSlikProgressBar from "../../../../lib/query/sqllite.query.lib";
import { Schema, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {

    const url = new URL(req.url);
    const params = {
      id: url.searchParams.has("id") ? Number(url.searchParams.get("id")) : undefined,
      requestId: url.searchParams.get("requestId") || undefined,
      period: url.searchParams.get("period") || undefined,
      schema: url.searchParams.has("schema") ? url.searchParams.get("schema") as Schema : undefined,
      progressBarPercent: url.searchParams.has("progressBarPercent") ? Number(url.searchParams.get("progressBarPercent")) : undefined,
      status: url.searchParams.has("status") ? url.searchParams.get("status") as Status : undefined,
      message: url.searchParams.get("message") || undefined,
    };

    const progressBars = await QueryDBSlikProgressBar.get(
      params,
    );


    return NextResponse.json(progressBars);
  } catch (error: any) {
    console.error("Error processing DB Slik Progress Bar request:", error.message || error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message || error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { request_id, period, schema, progress_bar_percent, status, message } = await req.json();
    const result = await QueryDBSlikProgressBar.insert(
      { request_id, period, schema, progress_bar_percent, status, message },
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error processing POST request:", error.message || error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message || error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const queryBody = await req.json();

    const params = {
      id: req.url.includes("id") ? Number(new URL(req.url).searchParams.get("id")) : undefined,
      requestId: req.url.includes("requestId") ? String(new URL(req.url).searchParams.get("requestId")) : undefined,
      period: req.url.includes("period") ? String(new URL(req.url).searchParams.get("period")) : undefined,
      schema: req.url.includes("schema") ? new URL(req.url).searchParams.get("schema") as Schema : undefined,
      progressBarPercent: req.url.includes("progressBarPercent") ? Number(new URL(req.url).searchParams.get("progressBarPercent")) : undefined,
      status: req.url.includes("status") ? String(new URL(req.url).searchParams.get("status")) : undefined,
      message: req.url.includes("message") ? String(new URL(req.url).searchParams.get("message")) : undefined,
    };

    const updateResult = await QueryDBSlikProgressBar.update(
      queryBody,
      {
        id: params.id,
        request_id: params.requestId,
        period: params.period,
        schema: params.schema,
      },
    );

    return NextResponse.json(updateResult);
  } catch (error: any) {
    console.error("Error processing PUT request:", error.message || error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message || error }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const deleteId = new URL(req.url).searchParams.get("deleteId");
    if (!deleteId) {
      return NextResponse.json({ message: "Delete ID is required" }, { status: 400 });
    }
    const deleteResult = await QueryDBSlikProgressBar.delete(Number(deleteId));
    return NextResponse.json(deleteResult, { status: 204 });
  } catch (error: any) {
    console.error("Error processing DELETE request:", error.message || error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message || error }, { status: 500 });
  }
}
