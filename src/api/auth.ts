import api from '.';
import type { EnumRole } from '../types/UserAuth';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: EnumRole;
    verified: boolean;
  };
}

function login(email: string, password: string) {
  return api.post<LoginResponse>('/auth/login', { email, password });
}

export { login };
