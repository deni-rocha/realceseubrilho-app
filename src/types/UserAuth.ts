import type { User } from './User';

export interface UserAuth extends User {
  role: EnumRole;
}

export type EnumRole = 'ADMIN' | 'CUSTOMER';
