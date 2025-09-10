import type { User } from './User';

export interface UserDetails extends User {
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
  };
}
