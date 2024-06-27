import { useContext } from 'react';
import { AuthContext } from './auth-context';

const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
};
export { useAuthContext };
