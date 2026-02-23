// src/services/claims.ts
import CreateAxiosApiClient from "@/lib/axios.lib";

const apiClient = CreateAxiosApiClient({
  baseURL: "/api/server", // Sesuaikan dengan config base URL API kamu
});

export interface IClaim {
  id: number;
  uuid?: string;
  total_amount: number;
  status: "draft" | "submitted" | "reviewed" | "approved" | "rejected";
  insurance_id?: string;
  user_id?: number;
}

class ClaimsService {
  // GET /claims
  static async getClaims(params?: { status?: string; user_id?: number; page?: number; limit?: number }) {
    const response = await apiClient.get("/claims", { params });
    return response.data;
  }

  // GET /claims/{id} (Jika ada endpoint detail)
  static async getClaimById(id: string | number) {
    const response = await apiClient.get(`/claims/${id}`);
    return response.data;
  }

  // POST /claims (Create Draft)
  static async createDraft(data: { insurance_id: string; total_amount: number }) {
    const response = await apiClient.post("/claims", data);
    return response.data;
  }

  // PUT /claims/{id}/draft
  static async updateDraft(id: string | number, data: { total_amount: number }) {
    const response = await apiClient.put(`/claims/draft/${id}`, data);
    return response.data;
  }

  // POST /claims/{id}/submit
  static async submitClaim(id: string | number) {
    const response = await apiClient.post(`/claims/submit/${id}`);
    return response.data;
  }

  // POST /claims/{id}/review
  static async reviewClaim(id: string | number) {
    const response = await apiClient.post(`/claims/review/${id}`);
    return response.data;
  }

  // POST /claims/{id}/approve
  static async approveClaim(id: string | number) {
    const response = await apiClient.post(`/claims/approve/${id}`);
    return response.data;
  }

  // POST /claims/{id}/reject
  static async rejectClaim(id: string | number) {
    const response = await apiClient.post(`/claims/reject/${id}`);
    return response.data;
  }
}

export default ClaimsService;
