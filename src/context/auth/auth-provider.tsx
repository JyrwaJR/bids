import axios, { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import ThemeProvider from '@components/layout/ThemeToggle/theme-provider';
import { showToast } from '@src/components/ui/show-toast';
import {
  FailedToastTitle,
  SuccessToastTitle
} from '@src/constants/toast-message';
import { useCMutation } from '@src/hooks';
import { Props } from '@src/types';

import { AuthContext, UserType } from './auth-context';
const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!;
interface LoginTProps {
  email: string;
  password: string;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
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

  const headers = useCallback(() => {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`
      }
    };
  }, [cookies?.token]);

  const onLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${baseUrl}/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies?.token}`
          }
        }
      );

      if (res.status === 200) {
        removeCookie('token');
        router.push('/');
        setIsLoggedIn(false);
        setIsToken('');
        setUser(null);
        showToast(SuccessToastTitle, res.data.message);
      }
      showToast(FailedToastTitle, 'Something went wrong');
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
  }, [removeCookie, router, cookies.token]);

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

  const verifyToken = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/user`, headers());
      if (!!res.data.data.id) {
        const data = res.data.data;
        setUser({
          email: data.email,
          id: data.id,
          name: data.name,
          role: data.role
        });
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
    }
  }, [headers]);

  useEffect(() => {
    if (cookies?.token) {
      verifyToken();
    }
  }, [cookies, verifyToken]);

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
          user: user,
          isLoggedIn: isLoggedIn
        }}
      >
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
};
