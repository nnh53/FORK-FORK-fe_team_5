// Define the types locally to avoid import issues
type Role = "ROLE_MANAGER" | "ROLE_STAFF" | "ROLE_MEMBER" | "ROLE_GUEST";

interface UserLoginResponse {
  tokenType: string;
  id: number;
  username: string;
  roles: Role[];
  message: string;
  token: string;
  refresh_token: string;
  full_name?: string; // Adding this for displaying in Welcome component
}

export const usersMockData: Record<string, UserLoginResponse> = {
  "guest@example.com": {
    tokenType: "Bearer",
    id: 1,
    username: "Guest User",
    full_name: "Guest User",
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
