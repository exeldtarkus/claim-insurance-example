import axios, {AxiosError, AxiosResponse, CreateAxiosDefaults} from "axios";

const CreateAxiosApiClient = (axiosCreate: CreateAxiosDefaults) => {
  const apiClient = axios.create({...axiosCreate, timeout: 1000000 * 10});

  apiClient.interceptors.request.use(
    config => {
      return config;
    },
    (error: AxiosError) => {
      console.error("[Axios Request Error]", error.message);
      return Promise.reject(error);
    },
  );

  // Post-handler (Response Interceptor)
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const message =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Unexpected error occurred";

      if (error.status === 401) {
        console.warn("Unauthorized: Session expired or invalid token. Attempting to remove token via API.");
        await axios.delete("/api/me/remove/token");
        window.location.reload();


        // try {
        //   await axios.delete("/api/me/remove/token");
        //   console.log("Token removal API called successfully. Redirecting to login.");
        //   window.location.href = "/login";
        // } catch (removeError) {
        //   console.error("Failed to call token removal API:", removeError);
        //   window.location.href = "/login";
        // }

        return Promise.reject(error);
      }

      console.warn(`[Axios Response Error] - ${message}`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: {
          message: (error?.response?.data as { message?: string })?.message
        },
      });

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default CreateAxiosApiClient;
