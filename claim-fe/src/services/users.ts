
import { IUserService } from "@/interfaces/IUsersResponseData";
import CreateAxiosApiClient from "@/lib/axios.lib";

const apiClient = CreateAxiosApiClient({
  baseURL: "/api/server/user",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

class Users {
  static async findUser(): Promise<IUserService | null> {
    const response = await apiClient.get<{ data: IUserService }>("/");
    return response.data.data;
  }
}

export default Users;
