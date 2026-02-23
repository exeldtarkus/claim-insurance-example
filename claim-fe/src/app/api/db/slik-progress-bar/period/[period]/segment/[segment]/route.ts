/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryDBSlikProgressBar from "../../../../../../../../lib/query/sqllite.query.lib";
import { Schema } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {
    const { pathname } = req.nextUrl;
    const url = pathname.split("/");

    const period = url[url.indexOf("period") + 1];   // Get the period (e.g., '2025-04')
    const segment = url[url.indexOf("segment") + 1]; // Get the segment (e.g., 'abc123')

    const queryParams = new URL(req.url).searchParams;

    console.log("queryParams", queryParams);
    console.log("Extracted Period:", period);
    console.log("Extracted Segment:", segment);

    const queryBody = await req.json();
    console.log("queryBody", queryBody);

    const allowSegment = ["D01", "F01"];
    if (!allowSegment.includes(segment)) {
      return NextResponse.json({ message: `segment ${segment} now allowed` }, { status: 401 });
    }

    if (!queryBody.request_id || typeof queryBody.progress_bar_percent !== "number" || queryBody.status === undefined || queryBody.status === null) {
      return NextResponse.json({ message: "Missing required fields: request_id, progress_bar_percent, and status are required" }, { status: 400 });
    }

    const validStatuses = ["done", "failed", "on_progress", "complete"];
    if (!validStatuses.includes(queryBody.status)) {
      return NextResponse.json({ message: "Invalid status value. Valid values are \"complete\", \"done\", \"failed\", or \"on_progress\"." }, { status: 400 });
    }

    if (typeof queryBody.progress_bar_percent !== "number" || queryBody.progress_bar_percent < 0 || queryBody.progress_bar_percent > 100) {
      return NextResponse.json({ message: "progress_bar_percent must be a number between 0 and 100" }, { status: 400 });
    }

    const checkDataIsExist = await QueryDBSlikProgressBar.get({period: period, schema: segment as Schema});

    if (checkDataIsExist.length === 0) {
      await QueryDBSlikProgressBar.insert(
        {
          request_id: queryBody.request_id,
          message: queryBody.message,
          period: period,
          progress_bar_percent: queryBody.progress_bar_percent,
          status: queryBody.status,
          schema: segment as any,
        }
      );
      return NextResponse.json({message: "data not found success insert"});
    }

    await QueryDBSlikProgressBar.update(
      queryBody,
      {
        period: period, schema: segment as Schema
      }
    );

    return NextResponse.json({message: "success updated!"});
  } catch (error: any) {
    console.error("Error processing PUT request:", error.message || error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message || error }, { status: 500 });
  }
}
