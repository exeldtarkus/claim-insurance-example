
import { ISlikSetValidationServicePayload, ISlikSetValidationServiceResponse } from "@/interfaces/ISlikService";
import { showAlert } from "@/utils/showAlert";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/server",
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const getMessageAfterColon = (msg: string) => {
  const parts = msg.split(":");
  return parts.length > 1 ? parts[1].trim() : msg;
};

class SlikButtonHeader {

  static async setValidationData(dataPost:ISlikSetValidationServicePayload): Promise<ISlikSetValidationServiceResponse | null> {
    try {
      const response = await apiClient.post<{ data: ISlikSetValidationServiceResponse }>(`/slik/set-validation`,dataPost);
      return response.data.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err?.response?.data?.message || "Unauthorized access or login failed";
        showAlert({
          title: "Failed!",
          text: getMessageAfterColon(message),
          icon: "warning",
          confirmButtonText: "Close",
        });
        console.warn(`[SetValidation.${dataPost.schema}] Axios error:`, message);
        return null;
      }

      console.error(`[SetValidation.${dataPost.schema}] Unknown error:`, err);
      return null;
    }
  }
}

export default SlikButtonHeader;
