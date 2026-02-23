
import { IDashboardServicesResponse } from "@/interfaces/IDashboardService";
import CreateAxiosApiClient from "@/lib/axios.lib";

const apiClient = CreateAxiosApiClient({
  baseURL: "/api/server/dashboard",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

class Dashboard {
  static async statistics(year: number): Promise<IDashboardServicesResponse | null> {
    const response = await apiClient.get<{ data: IDashboardServicesResponse }>(`/statistics/${year}`);
    return response.data.data;
  }

  static async metrics(year: number): Promise<IDashboardServicesResponse | null> {
    const response = await apiClient.get<{ data: IDashboardServicesResponse }>(`/metrics/${year}`);
    return response.data.data;
  }
}

export default Dashboard;
