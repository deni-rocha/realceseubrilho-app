export interface User {
  id: string;
  name: string;
  email: string;
  role: EnumRole;
  verified: boolean;
}

export type EnumRole = 'ADMIN' | 'CUSTOMER';
