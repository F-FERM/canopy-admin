import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";
import { LocalStorage } from "@/utility/LocalStorage";

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expiredAt: string;
  [key: string]: any;
}

export const login = async (credentials: LoginDto) => {
  try {
    const res = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data;
      const errorMessage =
        apiError?.error || apiError?.message || error.message || "Login failed";
      const normalizedError = new Error(errorMessage);

      (normalizedError as any).statusCode =
        apiError?.statusCode || error.response?.status;
      (normalizedError as any).raw = apiError;

      throw normalizedError;
    }
    throw error;
  }
};

export const logout = () => {
  // Clear localStorage and cookies
  LocalStorage.removeItem("access_token");
  LocalStorage.removeItem("user");

  // Clear cookie
  document.cookie = "access_token=; path=/; max-age=0";
};
