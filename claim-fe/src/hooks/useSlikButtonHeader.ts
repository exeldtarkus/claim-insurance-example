
import { ISlikSetValidationServicePayload, ISlikSetValidationServiceResponse } from "@/interfaces/ISlikService";
import SlikButtonHeader from "@/services/slikButtonHeader";

export function useSlikButtonHeader() {

  const setValidationData: (dataPost: ISlikSetValidationServicePayload) => Promise<ISlikSetValidationServiceResponse> = async (dataPost: ISlikSetValidationServicePayload) => {
    const data = await SlikButtonHeader.setValidationData(dataPost);
    if (!data) return {};
    return data;
  };

  return {
    setValidationData,
  };
}
