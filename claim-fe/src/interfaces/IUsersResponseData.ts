export interface IUserService {
  username: string;
  isLocked: "Y" | "N";
  fullName: string;
  email: string | null;
  useDefaultPassword: boolean;
  role: string;
}
