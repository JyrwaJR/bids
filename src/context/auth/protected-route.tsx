// components/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from './use-auth-context';
import { LoadingPage } from '@components/pages/loading';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn: isAuthenticated, isLoading: loading } = useAuthContext();
  const router = useRouter();
  const pathName = usePathname();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowLoading(true);
      return;
    }
    // setTimeout(() => {
    if (!isAuthenticated) {
      router.replace(`/`);
    } else if (pathName === '/') {
      router.push('/dashboard');
    }
    setShowLoading(false);
    // }, 1000);
  }, [isAuthenticated, loading, pathName, router]);

  if (showLoading) {
    return <LoadingPage />;
  }

  return children;
};

export default ProtectedRoute;
