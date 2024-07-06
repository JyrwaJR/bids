import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
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
  redirect?: string | null | undefined;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isToken, setIsToken] = useState<string>(cookies?.token);
  const router = useRouter();
  const loginMutation = useCMutation({
    method: 'POST',
    queryKey: ['login', 'mutation'],
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
        return;
      }
      showToast(FailedToastTitle, 'Something went wrong');
      return;
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

  const onLogin = async ({ email, password, redirect }: LoginTProps) => {
    try {
      setIsLoading(true);
      const res = await loginMutation.mutateAsync({
        email: email,
        password: password
      });

      if (!!res.data.token) {
        setCookie('token', res.data.token, {
          path: '/',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
          secure: true,
          sameSite: 'strict'
        });
        const response = await axios.get(`${baseUrl}/user`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${res.data.token}`
          }
        });

        setUser({
          email: response.data.data.email,
          id: response.data.data.id,
          name: response.data.data.name,
          role: response.data.data.role[0]
        });
        setIsToken(cookies?.token);
        setIsLoggedIn(!!cookies?.token);
        const url = redirect ? redirect : '/dashboard';
        router.push(url);
        return;
      } else if (res.data.success === false) {
        showToast(
          FailedToastTitle,
          'Invalid email or password. Please try again'
        );
        return;
      } else {
        showToast(FailedToastTitle, res.data.message);
        return;
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
      if (!!res.data.data.id || res.status === 200) {
        const data = res.data.data;
        setUser({
          email: data.email,
          id: data.id,
          name: data.name,
          role: data.role[0]
        });
        setIsToken(cookies?.token);
        setIsLoggedIn(!!cookies?.token);
        return;
      }
      return;
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
  }, [headers, cookies?.token]);

  useEffect(() => {
    if (cookies?.token || isToken) {
      verifyToken();
    }
  }, [cookies, verifyToken, isToken]);
  axios.defaults.headers.common['Authorization'] = isToken;
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <AuthContext.Provider
        value={{
          id: '',
          isLoading: isLoading,
          onLogin: async (email, password, redirect) =>
            await onLogin({
              email: email,
              password: password,
              redirect: redirect
            }),
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
