// Define the types locally to avoid import issues

import { UserLoginResponse } from "./interfaces/users.interface.ts";

export const usersMockData: Record<string, UserLoginResponse> = {
  "guest@example.com": {
    tokenType: "Bearer",
    id: 1,
    username: "Guest User",
    roles: ["ROLE_GUEST"],
    message: "Login successful",
    token: "mock-jwt-token-for-guest-user",
    refresh_token: "mock-refresh-token-for-guest-user",
  },
};

export const loginMock = (email: string, password: string): UserLoginResponse | null => {
  // For simplicity, we're only checking email and ignoring password in this mock
  if (usersMockData[email]) {
    return usersMockData[email];
  }
  return null;
};
