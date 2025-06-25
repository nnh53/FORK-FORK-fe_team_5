//API quăng hết vào đây
import axios from "axios";
import { API_URL } from "../config/environments/endpoints";

import type { CustomAPIResponse } from "@/type-from-be";
import type { LoginDTO, UserLoginResponse } from "../interfaces/users.interface";
import { $api } from "./api";

export const login = async (payload: LoginDTO): Promise<UserLoginResponse> => {
  try {
    const loginQuery = $api.useMutation("post", "/auth/authenticate");

    loginQuery.mutate({
      body: {
        email: payload.email,
        password: payload.password,
      },
    });
    // return loginQuery.data?.result as AuthenticationResponse;
  } catch (error) {
    if (error != null) {
      const errorMessage = (error as CustomAPIResponse).message || "An error occurred during register";
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
