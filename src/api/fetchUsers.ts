import api from '.';
import type { UserDetails } from '../types/UserDetails';

const fetchUsers = async () => {
  const response = await api.get<UserDetails[]>('/users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  return response.data;
};

export default fetchUsers;
