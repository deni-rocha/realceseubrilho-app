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

interface ForgotPasswordDto {
  email: string;
}

interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

function login(email: string, password: string) {
  return api.post<LoginResponse>('/auth/login', { email, password });
}

function forgotPassword(data: ForgotPasswordDto) {
  return api.post('/auth/forgot-password', data);
}

function resetPassword(data: ResetPasswordDto) {
  return api.post('/auth/reset-password', data);
}

export { login, forgotPassword, resetPassword };
export type { ForgotPasswordDto, ResetPasswordDto };