export interface IMasterValidationPayload {
  errorCode: string;
}

export interface IMasterValidationResponse {
  errorCode: string;
  column: string,
  validation: string,
  editable: boolean,
}