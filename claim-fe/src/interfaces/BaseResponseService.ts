export interface IBaseResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  status: number;
  timestamp?: string;
}
