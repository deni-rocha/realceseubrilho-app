import api from '.';
import type { UserAuth } from '../types/UserAuth';

const fetchUsers = async () => {
  const response = await api.get<UserAuth[]>('/users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  return response.data;
};

export default fetchUsers;
