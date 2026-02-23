/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/db/slik-progress-bar",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export interface IDBSlikProgressBar {
  id: number;
  request_id: string;
  period: string;
  schema: string;
  progress_bar_percent: number;
  status: string;
  message: string;
}

class SlikProgressBarServices {
  static async get(params: {
    period?: string;
    schema?: string;
    request_id?: string;
  }): Promise<{data?: IDBSlikProgressBar[], errorMessage: string | null}> {
    try {
      const response = await apiClient.get("/", { params });
      return {data: response.data, errorMessage: null};
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err?.response?.data?.message || "Failed to fetch progress bars";
        console.warn("[SlikProgressBarServices.getSlikProgressBarServicess] Axios error:", message);
        return { errorMessage: message };
      }

      console.error("[SlikProgressBarServices.getSlikProgressBarServicess] Unknown error:", err);
      return { errorMessage: "Unexpected error occurred" };
    }
  }

  static async insert(payload: {
    request_id: string;
    period: string;
    schema: string;
    progress_bar_percent: number;
    status: string;
    message: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post("/", payload);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err?.response?.data?.message || "Failed to add progress";
        console.warn("[SlikProgressBarServices.addProgress] Axios error:", message);
        return { errorMessage: message };
      }

      console.error("[SlikProgressBarServices.addProgress] Unknown error:", err);
      return { errorMessage: "Unexpected error occurred" };
    }
  }

  static async update(payload: {
    id: number;
    updatedPercent: number;
    updatedStatus: string;
  }): Promise<any> {
    try {
      const response = await apiClient.put("/", payload);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err?.response?.data?.message || "Failed to update progress";
        console.warn("[SlikProgressBarServices.updateProgress] Axios error:", message);
        return { errorMessage: message };
      }

      console.error("[SlikProgressBarServices.updateProgress] Unknown error:", err);
      return { errorMessage: "Unexpected error occurred" };
    }
  }

  static async delete(id: number): Promise<any> {
    try {
      const response = await apiClient.delete("/", { params: { deleteId: id } });
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err?.response?.data?.message || "Failed to delete progress";
        console.warn("[SlikProgressBarServices.deleteProgress] Axios error:", message);
        return { errorMessage: message };
      }

      console.error("[SlikProgressBarServices.deleteProgress] Unknown error:", err);
      return { errorMessage: "Unexpected error occurred" };
    }
  }
}

export default SlikProgressBarServices;
