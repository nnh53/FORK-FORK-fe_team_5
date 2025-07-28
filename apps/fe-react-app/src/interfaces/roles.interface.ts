export type ROLE_TYPE = "ADMIN" | "STAFF" | "MEMBER";

// Constants for role values when needed as runtime values
export const ROLES = {
  ADMIN: "ADMIN" as const,
  STAFF: "STAFF" as const,
  MEMBER: "MEMBER" as const,
} as const;


