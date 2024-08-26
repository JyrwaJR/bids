import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import ThemeProvider from '@components/layout/ThemeToggle/theme-provider';
import { showToast } from '@src/components/ui/show-toast';
import { FailedToastTitle } from '@src/constants/toast-message';
import { useCMutation } from '@src/hooks';
import { Props } from '@src/types';
import { AuthContext, UserType } from './auth-context';
import { axiosInstance } from '@lib/utils';

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
  const [isToken, setIsToken] = useState<string>(cookies?.token || '');
  const [isTokenSet, setIsTokenSet] = useState<boolean>(false); // Track token setting
  const router = useRouter();
  const loginMutation = useCMutation({
    method: 'POST',
    queryKey: ['login', 'mutation'],
    url: 'login'
  });

  const onLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!isToken) {
        return;
      }
      const res = await axios.post(
        `${baseUrl}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies?.token || isToken}`
          }
        }
      );
      if (res.status === 200) {
        removeCookie('token');
        setIsToken('');
        setIsLoggedIn(false);
        setUser(null);
        setIsTokenSet(false); // Reset token state
        router.refresh();
        localStorage.removeItem('savedRoute');
      } else {
        showToast(FailedToastTitle, 'Something went wrong',"destructive");
      }
    } catch (error: any) {
      removeCookie('token');
      showToast(
        FailedToastTitle,
        error.response?.data.message || 'An error occurred',
        'destructive'
      );
    } finally {
      setIsLoading(false);
    }
  }, [removeCookie, router, cookies?.token, isToken, setIsToken]);

  const onLogin = async ({ email, password }: LoginTProps) => {
    try {
      setIsLoading(true);
      const res = await loginMutation.mutateAsync({ email, password });

      if (res.data.token) {
        setCookie('token', res.data.token, {
          path: '/',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
          secure: true,
          sameSite: 'strict'
        });

        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${res.data.token}`;
        setIsToken(res.data.token);
        setIsTokenSet(true); // Token successfully set

        const response = await axios.get(`${baseUrl}/user`, {
          headers: {
            Authorization: `Bearer ${res.data.token}`
          }
        });

        setUser({
          email: response.data.data.email,
          id: response.data.data.id,
          name: response.data.data.name,
          role: response.data.data.role[0],
          centre_id: response.data.data.centre_id
        });

        router.refresh();
      } else {
        showToast(FailedToastTitle, 'Invalid email or password',"destructive");
      }
    } catch (error: any) {
      showToast(
        FailedToastTitle,
        error.response?.data.message || 'An error occurred',
        'destructive'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = useCallback(async () => {
    try {
      if (isToken) {
        const res = await axios.get(`${baseUrl}/user`, {
          headers: {
            Authorization: `Bearer ${isToken}`
          }
        });
        if (res.status === 200 && res.data.data.id) {
          const data = res.data.data;

          setUser({
            email: data.email,
            id: data.id,
            name: data.name,
            role: data.role[0],
            centre_id: data.centre_id
          });

          setIsLoggedIn(true); // Only set after successful token verification
        }
      }
    } catch (error: any) {
      removeCookie('token');
      setUser(null);
      setIsLoggedIn(false);
      router.push('/login');
    }
  }, [removeCookie, router, isToken]);

  useEffect(() => {
    if (cookies?.token || isToken) {
      verifyToken();
    }
  }, [cookies?.token, verifyToken, isToken]);

  // Set axios instance token when isToken is updated
  useEffect(() => {
    if (isToken && !isTokenSet) {
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${isToken}`;
      setIsTokenSet(true); // Mark token as set
    }
  }, [isToken, isTokenSet]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <AuthContext.Provider
        value={{
          isLoading,
          onLogin: async (email, password, redirect) =>
            await onLogin({ email, password, redirect }),
          onLogout,
          token: isToken,
          user,
          isLoggedIn
        }}
      >
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
};
