import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from './use-auth-context';
import { LoadingPage } from '@components/pages/loading';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn: isAuthenticated, isLoading: loading } = useAuthContext();
  const router = useRouter();
  const pathName = usePathname();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    const savedRoute = localStorage.getItem('savedRoute');

    if (!isAuthenticated) {
      if (pathName !== '/') {
        localStorage.setItem('savedRoute', pathName); // Save the current route if not on login page
        router.replace('/'); // Redirect to login page
      }
    } else {
      if (savedRoute) {
        localStorage.removeItem('savedRoute');
        router.push(savedRoute); // Redirect to the saved route
      } else if (pathName === '/') {
        router.push('/dashboard'); // Redirect to dashboard if on home page
      }
    }

    setShowLoading(false);
  }, [isAuthenticated, loading, pathName, router]);

  if (showLoading) {
    return <LoadingPage />;
  }

  return isAuthenticated || pathName === '/' ? children : null; // Render children only if authenticated or on login page
};

export default ProtectedRoute;
