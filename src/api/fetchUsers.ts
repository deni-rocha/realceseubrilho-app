import api from '.';
import type { UserDetails } from '../types/UserDetails';
import handleApiError from '../utils/handleApiError';

const fetchUsers = async () => {
  try {
    const response = await api.get<UserDetails[]>('/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export default fetchUsers;
