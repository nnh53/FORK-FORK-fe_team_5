import type { components } from "@/schema-from-be";
import type { ROLE_TYPE } from "./roles.interface";

export type AuthLoginData = Omit<
  components["schemas"]["AuthenticationResponse"],
  "roles"
> & {
  roles: ROLE_TYPE[];
};
