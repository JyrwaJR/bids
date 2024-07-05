// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from './use-auth-context';
const LoadingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center space-x-2 bg-primary dark:bg-primary-foreground">
      <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground [animation-delay:-0.3s] dark:bg-primary"></div>
      <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground [animation-delay:-0.15s] dark:bg-primary"></div>
      <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground dark:bg-primary"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn: isAuthenticated, isLoading: loading } = useAuthContext();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/`);
    }
  }, [isAuthenticated, loading, router, pathName]);

  useEffect(() => {
    if (isAuthenticated && pathName === '/') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathName, router]);

  if (loading && !isAuthenticated && pathName !== '/') {
    return <LoadingPage />;
  }
  return children;
};

export default ProtectedRoute;
