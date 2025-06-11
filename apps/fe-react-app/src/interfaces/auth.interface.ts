//để dành khi nào có user rồi áp sau
import type { UserLoginResponse } from './users.interface';

export type AuthLoginData = Pick<UserLoginResponse, 'token' | 'roles' | 'id' | 'username'>;
