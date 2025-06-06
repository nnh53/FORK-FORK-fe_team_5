//để dành khi nào có user rồi áp sau
import { type LoginResponse } from "./users.interface";

export type AuthenLoginData = Pick<LoginResponse, "access_token" | "refresh_token" | "tokenType" | "id" | "roles" | "username" | "message">;