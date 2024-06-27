import { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import ThemeProvider from '@components/layout/ThemeToggle/theme-provider';
import { showToast } from '@src/components/ui/show-toast';
import {
  FailedToastTitle,
  SuccessToastTitle
} from '@src/constants/toast-message';
import { useCMutation } from '@src/hooks';
import { Props } from '@src/types';

import { AuthContext } from './auth-context';

interface LoginTProps {
  email: string;
  password: string;
}
export const AuthProvider = ({ children }: Props) => {
  const [cookies, setCookie] = useCookies(['token']);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isToken, setIsToken] = useState<string>(cookies?.token);
  const router = useRouter();
  const pathName = usePathname();
  const loginMutation = useCMutation({
    method: 'POST',
    queryKey: [],
    url: 'login'
  });
  const onLogin = async ({ email, password }: LoginTProps) => {
    try {
      setIsLoading(true);
      const res = await loginMutation.mutateAsync({
        email: email,
        password: password
      });
      if (res.success === true) {
        setCookie('token', res.data.token, { path: '/' });
        setIsToken(cookies?.token);
        setIsLoggedIn(!!cookies?.token);
        showToast(SuccessToastTitle, res.data.message);
        router.push(`/dashboard`);
      } else if (res.data.success === false) {
        showToast(FailedToastTitle, 'Invalid email or password');
      } else {
        showToast(FailedToastTitle, res.data.message);
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        showToast(
          FailedToastTitle,
          error.response?.data.message || 'An error occurred'
        );
        return;
      }
      showToast(
        FailedToastTitle,
        error.message || 'An error occurred',
        'destructive'
      );
      return;
    } finally {
      setIsLoading(false);
    }
  };
  const onLogout = () => {};
  useEffect(() => {
    if (cookies?.token) {
      setIsToken(cookies?.token);
      setIsLoggedIn(!!cookies?.token);
    }
  }, [cookies]);
  if (isLoggedIn && pathName === '/') {
    console.log('Authenticated => ', pathName);
    router.replace('/dashboard');
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <AuthContext.Provider
        value={{
          id: '',
          isLoading: isLoading,
          onLogin: async (email, password) =>
            await onLogin({ email: email, password: password }),
          onLogout: onLogout,
          token: isToken,
          isLoggedIn: isLoggedIn
        }}
      >
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
};
