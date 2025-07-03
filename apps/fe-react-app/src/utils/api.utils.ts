//API quăng hết vào đây
// import axios from "axios";
// import { API_URL } from "../config/environments/endpoints";

// Comment out doLogout - using client-side only logout for simplicity
// export const doLogout = async (token: string): Promise<boolean> => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/users/logout`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // Pass token in Authorization header
//         },
//       },
//     );
//     if (response.status === 200) {
//       console.log("Logout successful.");
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.warn("API logout failed (this is normal if server is not running):", error);
//     // Don't throw the error, just return false to indicate API call failed
//     return false;
//   }
// };
