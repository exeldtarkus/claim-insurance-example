/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import {
  ILoginServicesPayload,
  ILoginServicesResponse,
  IUpdatePasswordPayload,
  IUpdatePasswordResponse,
} from "@/interfaces/IAuthLoginService";
import CreateAxiosApiClient from "@/lib/axios.lib";

const apiClient = CreateAxiosApiClient({
  baseURL: "/api/server/auth",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

class Auth {
  static async login(payload: ILoginServicesPayload): Promise<ILoginServicesResponse> {
    try {
      const response = await apiClient.post<ILoginServicesResponse>("/login", payload);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err?.response?.data?.message || "Unauthorized access or login failed";
        console.warn("[Auth.login] Axios error:", message);
        return { errorMessage: message };
      }

      console.error("[Auth.login] Unknown error:", err);
      return { errorMessage: "Unexpected error occurred" };
    }
  }

  static async logout(): Promise<boolean> {
    try {
      await apiClient.post("/logout");
      return true;
    } catch (err: unknown) {
      console.error("[Auth.logout] Error:", err);
      return false;
    }
  }

  static async verifyToken(): Promise<boolean> {
    try {
      await apiClient.get("/verify-token");
      return true;
    } catch (err: unknown) {
      console.warn("[Auth.verifyToken] Invalid or expired token.", err);
      return false;
    }
  }

  static async refreshToken(): Promise<{ token?: string; errorMessage?: string }> {
    try {
      const response = await apiClient.post("/refresh-token");
      return { token: response.data?.token };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err?.response?.data?.message || "Failed to refresh token";
        console.warn("[Auth.refreshToken] Axios error:", message);
        return { errorMessage: message };
      }

      console.error("[Auth.refreshToken] Unknown error:", err);
      return { errorMessage: "Unexpected refresh error" };
    }
  }

  static async updatePassword(payload: IUpdatePasswordPayload): Promise<IUpdatePasswordResponse> {
    try {
      const response = await apiClient.post("/update-password", payload);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err?.response?.data?.message || "update password failed";
        console.warn("[Auth.updatePassword] Axios error:", message);
        return { errorMessage: message };
      }

      console.error("[Auth.updatePassword] Unknown error:", err);
      return { errorMessage: "Unexpected error occurred" };
    }
  }
}

export default Auth;
