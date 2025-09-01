import api from '.';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    verified: boolean;
  };
}

function login(email: string, password: string) {
  return api.post<LoginResponse>('/auth/login', { email, password });
}

export { login };
