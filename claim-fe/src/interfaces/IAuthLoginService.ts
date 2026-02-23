
export interface ILoginServicesPayload {
  username: string;
  password: string;
  captchaToken?: string;
  rememberMe?: boolean;
}

export interface ILoginServicesResponse {
  message?: string;
  token?: string;
  errorMessage?: string;
}

export interface IUpdatePasswordPayload {
  username: string;
  password: string;
  newPassword: string;
}

export interface IUpdatePasswordResponse {
  errorMessage?: string;
}
