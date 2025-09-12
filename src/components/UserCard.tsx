import type { UserDetails } from '../types/UserDetails';
import translateRole from '../utils/translateRole';

interface UserCardProps {
  user: UserDetails;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-green-800 flex items-center justify-center text-white font-bold text-xl">
            {user.name.charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">Nível de Acesso:</span>{' '}
          <span
            className={`font-semibold ${user.role.name === 'ADMIN' ? 'text-green-800' : 'text-blue-600'}`}
          >
            {translateRole(user.role.name)}
          </span>
        </p>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">Status:</span>
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              user.verified
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {user.verified ? 'Verificado' : 'Não Verificado'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
