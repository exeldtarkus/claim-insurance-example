import CreateAxiosApiClient from "@/lib/axios.lib";

const apiClient = CreateAxiosApiClient({
  baseURL: "/api/server",
});

export interface IInsurance {
  id: number;
  uuid: string;
  user_id?: number;
  amount: number;
  insurance_type: string;
  desc?: string;
}

class InsuranceService {
  static async getAllInsurances() {
    const response = await apiClient.get("/insurance");
    return response.data?.data || response.data;
  }

  static async getInsuranceById(id: string) {
    const response = await apiClient.get(`/insurance/${id}`);
    return response.data?.data || response.data;
  }
}

export default InsuranceService;
