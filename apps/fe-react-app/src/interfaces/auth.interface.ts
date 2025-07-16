export interface AuthLoginData {
  token: string;
  freshToken?: string;
  roles: ROLE_TYPE[];
  fullName: string;
  id: string;
}

import type { ROLE_TYPE } from "./roles.interface";
