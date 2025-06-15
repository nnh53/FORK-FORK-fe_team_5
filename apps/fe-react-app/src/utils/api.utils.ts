//API quăng hết vào đây
import axios from "axios";
import { API_URL } from "../config/environments/endpoints";

import type { LoginDTO, UserLoginResponse } from "../interfaces/users.interface";

export const login = async (payload: LoginDTO): Promise<UserLoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, payload);
    console.log("Data ở đây:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred during register";
      throw new Error(errorMessage);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const logout = async (token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      },
    );
    if (response.status === 200) {
      console.log("Logout successful.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
