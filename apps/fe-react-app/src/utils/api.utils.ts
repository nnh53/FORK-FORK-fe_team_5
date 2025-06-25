//API quăng hết vào đây
import axios from "axios";
import { API_URL } from "../config/environments/endpoints";

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
