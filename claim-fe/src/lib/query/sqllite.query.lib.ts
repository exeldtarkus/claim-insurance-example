/* eslint-disable @typescript-eslint/no-empty-object-type */
import { PrismaClient, slik_progress_bar, Schema, Status } from "@prisma/client";

export interface IDBRequestSlikProgressBar {
  id?: number;
  requestId?: string;
  period?: string;
  schema?: Schema;
  progressBarPercent?: number;
  status?: Status;
  message?: string;
}

export interface IDBSlikProgressBar extends slik_progress_bar {};

const logTemplate = "[Sql-Lite] - [Slik-Progress-Bar]";
const prisma = new PrismaClient();

class QueryDBSlikProgressBar {
  static async get(filter: IDBRequestSlikProgressBar): Promise<IDBSlikProgressBar[]> {
    console.log(logTemplate, "- [GET] - Filter:", JSON.stringify(filter));

    const rows = await prisma.slik_progress_bar.findMany({
      where: {
        id: filter.id,
        request_id: filter.requestId,
        period: filter.period,
        schema: filter.schema,
        progress_bar_percent: filter.progressBarPercent,
        status: filter.status,
        message: filter.message,
      },
    });

    return rows;
  }

  static async insert(payload: Omit<slik_progress_bar, "id">): Promise<slik_progress_bar> {
    console.log(logTemplate, "- [INSERT] - Payload:", JSON.stringify(payload));

    const inserted = await prisma.slik_progress_bar.create({
      data: payload,
    });

    return inserted;
  }

  static async update(
    data: Partial<Omit<slik_progress_bar, "id">>,
    where: Partial<Pick<slik_progress_bar, "id" | "request_id" | "period" | "schema">>
  ): Promise<{ message: string; changes: number }> {
    console.log(logTemplate, "- [UPDATE] - Data:", JSON.stringify(data), "Where:", JSON.stringify(where));

    const result = await prisma.slik_progress_bar.updateMany({
      where,
      data,
    });

    return {
      message: "Update successful",
      changes: result.count,
    };
  }

  static async delete(id: number): Promise<{ message: string; changes: number }> {
    console.log(logTemplate, "- [DELETE] - ID:", id);

    const result = await prisma.slik_progress_bar.deleteMany({
      where: { id },
    });

    return {
      message: "Progress deleted successfully",
      changes: result.count,
    };
  }
}

export default QueryDBSlikProgressBar;
