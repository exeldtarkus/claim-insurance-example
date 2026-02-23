import CreateAxiosApiClient from "../lib/axios.lib";

const apiClient = CreateAxiosApiClient({
  baseURL: "/api/server",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

class ReviewData {
  static async lsPeriod(): Promise<string[] | null> {
    const response = await apiClient.get<{ data: string[] }>("/period");
    return response.data.data;
  }

  static async getDtCompareMISandD01P1(period:string): Promise <Record<string, string> | null> {
    const response = await apiClient.get<{ data: Record<string, string> }>(`/review-data/compare-data-mis-and-p1/period/${period}/segment/d01`);
    return response.data.data;
  }

  static async getDtCompareMISandF01P1(period:string): Promise <Record<string, string> | null> {
    const response = await apiClient.get<{ data: Record<string, string> }>(`/review-data/compare-data-mis-and-p1/period/${period}/segment/f01`);
    return response.data.data;
  }

  static async getDtCreditQuality(period:string): Promise<Record<string, string>[] | null> {
    const response = await apiClient.get<{ data: Record<string, string>[] }>(`/review-data/credit-quality/period/${period}`);
    return response.data.data;
  }

  static async getDtConditionData(period:string): Promise<Record<string, string>[] | null> {
    const response = await apiClient.get<{ data: Record<string, string>[] }>(`/review-data/condition-data/period/${period}`);
    return response.data.data;
  }

  static async getDtRestructData(period:string): Promise<Record<string, string>[] | null> {
    const response = await apiClient.get<{ data: Record<string, string>[] }>(`/review-data/restruct-data/period/${period}`);
    return response.data.data;
  }

  static async getDtRangePart1(period:string): Promise<Record<string, string>[] | null> {
    const response = await apiClient.get<{ data: Record<string, string>[] }>(`/review-data/range-part1/period/${period}`);
    return response.data.data;
  }

  static async getDtRangePart2(period:string): Promise<Record<string, string>[] | null> {
    const response = await apiClient.get<{ data: Record<string, string>[] }>(`/review-data/range-part2/period/${period}`);
    return response.data.data;
  }

  static async getDtTotalF01(period:string): Promise<Record<string, string>[] | null> {
    const response = await apiClient.get<{ data: Record<string, string>[] }>(`/review-data/total-f01/period/${period}`);
    return response.data.data;
  }
}

export default ReviewData;
