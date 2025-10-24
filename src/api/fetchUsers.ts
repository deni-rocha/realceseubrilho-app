import api from '.';
import type { ApiError } from '../types/ApiError';
import type { UserDetails } from '../types/UserDetails';
import handleApiError from '../utils/handleApiError';

const fetchUsers = async () => {
  try {
    const response = await api.get<UserDetails[]>('/users');
    return response.data;
  } catch (error) {
    handleApiError(error as ApiError);
  }
};

export default fetchUsers;
