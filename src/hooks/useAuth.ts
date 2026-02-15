import { useAuthContext } from '@/context/AuthContext';
import { loginWithGoogle, logout } from '@/services/auth';

export function useAuth() {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  return {
    user,
    isLoading,
    isAuthenticated,
    login: loginWithGoogle,
    logout,
  };
}
