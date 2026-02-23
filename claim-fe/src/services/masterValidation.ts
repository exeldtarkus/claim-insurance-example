import { IMasterValidationPayload, IMasterValidationResponse } from "@/interfaces/IMasterValidationService";
import CreateAxiosApiClient from "@/lib/axios.lib";

const apiClient = CreateAxiosApiClient({
  baseURL: "/api/server/master/master-validation",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

class MasterValidationServices {
  
  static async getMasterValidation(): Promise<IMasterValidationResponse[]> {
    const response = await apiClient.get<{ data: IMasterValidationResponse[]}>(`/`);
    return response.data.data;
  }

  static async getMasterValidationByErrorCode(dataParams:IMasterValidationPayload): Promise<IMasterValidationResponse> {
    const response = await apiClient.get<{ data: IMasterValidationResponse}>(`/error-code/${dataParams.errorCode}`);
    return response.data.data;
  }

}

export default MasterValidationServices;
