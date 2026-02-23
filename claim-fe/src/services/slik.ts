import { IDownloadAllSlikPayload, ISlikCreatedJsonPayload, ISlikCreatedJsonResponse, ISlikHistoryValidation, ISlikHistoryValidationPayload, ISlikP1Payload, ISlikP1Response, ISlikP2Payload, ISlikP2Response, ISlikRemoveJsonPayload, ISlikSetValidationServicePayload, ISlikSetValidationServiceResponse, ISlikSetValueP1Payload, ISlikSetValueP1Response, ISlikSubmitPayload } from "@/interfaces/ISlikService";
import CreateAxiosApiClient from "@/lib/axios.lib";

const apiClient = CreateAxiosApiClient({
  baseURL: "/api/server/slik",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

class SlikServices {
  static async getDataP1(dataParams:ISlikP1Payload): Promise<ISlikP1Response> {
    const response = await apiClient.get<{ data: ISlikP1Response}>(`/p1/period/${dataParams.period}/segment/${dataParams.segment}?size=${dataParams.size}&page=${dataParams.page}`);
    return response.data.data;
  }

  static async getDataP2(dataParams:ISlikP2Payload): Promise<ISlikP2Response> {
    const response = await apiClient.get<{ data: ISlikP1Response}>(`/p2/period/${dataParams.period}/segment/${dataParams.segment}?size=${dataParams.size}&page=${dataParams.page}`);
    return response.data.data;
  }

  static async getValidationCodeP1(dataParams:ISlikP1Payload): Promise<string[]> {
    const response = await apiClient.get<{ data: string[]}>(`/p1/validation-code/period/${dataParams.period}/segment/${dataParams.segment}`);
    return response.data.data;
  }

  static async setValidationData(dataPost:ISlikSetValidationServicePayload): Promise<ISlikSetValidationServiceResponse | null> {
    const response = await apiClient.post<{ data: ISlikSetValidationServiceResponse }>(`/set-validation`,dataPost);
    return response.data.data;
  }

  static async updateDataP1(dataPost:ISlikSetValueP1Payload): Promise<ISlikSetValueP1Response | null> {
    const response = await apiClient.post<{ data: ISlikSetValueP1Response }>(`/p1/update-p1`,dataPost);
    return response.data.data;
  }

  static async updateDataP1ByErrorCode(dataPost:ISlikSetValueP1Payload): Promise<ISlikSetValueP1Response | null> {
    const response = await apiClient.post<{ data: ISlikSetValueP1Response }>(`/p1/update-p1-by-error-code`,dataPost);
    return response.data.data;
  }

  static async createdJson(dataPost:ISlikCreatedJsonPayload): Promise<ISlikCreatedJsonResponse | null> {
    const response = await apiClient.post<ISlikCreatedJsonResponse>(`/json/c`, dataPost);
    return response.data;
  }

  static async removeJson(dataPost:ISlikRemoveJsonPayload): Promise<{data: boolean} | null> {
    const response = await apiClient.post<{data: boolean}>(`/json/d`, dataPost);
    return response.data;
  }

  static async submit(dataPost:ISlikSubmitPayload): Promise<{message: string} | null> {
    const response = await apiClient.post<{message: string}>(`/submit`, dataPost);
    return response.data;
  }

  static async getHistoryValidation(dataParams:ISlikHistoryValidationPayload): Promise<ISlikHistoryValidation[]> {
    const urlPath = `/history-validation/period/${dataParams.period}/segment/${dataParams.segment}?batch=${dataParams.batch}`;
    const response = await apiClient.get<{ data: ISlikHistoryValidation[]}>(urlPath);
    return response.data.data;
  }

  static async downloadAllHistories(dataPost:IDownloadAllSlikPayload): Promise<{downloadUrl:string} | null> {
    const response = await apiClient.post<{ data: {downloadUrl:string} }>(`history-validation/donwload/all`, dataPost);
    return response.data.data;
  }
}

export default SlikServices;
