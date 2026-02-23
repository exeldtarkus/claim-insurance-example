/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ISlikSetValidationServicePayload {
  period: string;
  schema: string;
}

export interface ISlikCreatedJsonPayload {
  filename: string;
  data: any[];
}

export interface ISlikCreatedJsonResponse {
  filePath: string;
}

export interface ISlikRemoveJsonPayload {
  filepath: string;
}

export interface ISlikSubmitPayload {
  filePath?: string;
  period: string;
  segment: "D01" | "F01" | "ALL";
}

export interface IDownloadAllSlikPayload {
  period: string;
  batch: string;
  segment: "D01" | "F01" | "ALL";
}


export interface ISlikSetValidationServiceResponse {
  requestId?: string;
  message?: string;
  errorMessage?: string;
}

export interface ISlikP1Payload {
  period: string;
  segment: string;
  page?: string;
  size?: string;
}

export interface ISlikP2Payload {
  period: string;
  segment: string;
  page: string;
  size: string;
}

export interface ISlikP1Response {
  items: Record<string, string>[];
  totalData: string;
  page: string;
  size: string;
  totalPage: string;
}

export interface ISlikP2Response {
  items: Record<string, string>[];
  totalData: string;
  page: string;
  size: string;
  totalPage: string;
}

export interface ISlikSetValueP1Payload {
  period: string;
  segment: string;
  dataP1?: Record<string, string | number>[];
  errorCode?: string;
  fixedValue?: string;
}

export interface ISlikSetValueP1Response {
  message: string;
  status: number;
}

export interface ISlikHistoryValidationPayload {
  period: string;
  segment: string;
  batch: string;
}

export interface ISlikHistoryValidation {
  id: number;
  period: string; // e.g. "2025-05"
  segment: string; // e.g. "A01"
  batch: number;   // assuming integer batch number
  file_path: string;
  status: "uploaded" | "pending" | "failed" | string; // restrict if you know statuses
  created_at: string; // ISO date string
  filePath: string;   // duplicate of file_path but camelCase
  createdAt: string;  // duplicate of created_at but camelCase
}

// export interface ISlikHistoryValidationResponse {
//   items: ISlikHistoryValidation[];
//   totalData: string;
//   page: string;
//   size: string;
//   totalPage: string;
// }
