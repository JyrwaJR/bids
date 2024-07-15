// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from './use-auth-context';

const LoadingPage = () => (
  <div className="flex h-screen items-center justify-center space-x-2 bg-primary dark:bg-primary-foreground">
    <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground [animation-delay:-0.3s] dark:bg-primary"></div>
    <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground [animation-delay:-0.15s] dark:bg-primary"></div>
    <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground dark:bg-primary"></div>
    <span className="sr-only">Loading...</span>
  </div>
);
// only redirect if the state is update and run the
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn: isAuthenticated, isLoading: loading } = useAuthContext();
  const router = useRouter();
  const pathName = usePathname();

  // useEffect(() => {
  //   if (loading) return;
  //   setTimeout(() => {
  //     if (!isAuthenticated) {
  //       router.replace(`/`);
  //     } else if (pathName === '/') {
  //       router.push('/dashboard');
  //     }
  //   }, 2000);
  // }, [isAuthenticated, loading, pathName, router]);

  if (loading && pathName !== '/' && !isAuthenticated) {
    return <LoadingPage />;
  }

  return children;
};

export default ProtectedRoute;
