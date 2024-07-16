import axios, { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { showToast } from '@src/components/ui/show-toast';

interface CQueryProps {
  queryKey?: any[];
  url: string;
  enabled?: boolean;
  staleTime?: number;
}

interface ApiResponse {
  status: number;
  message: string;
  data?: any;
  error?: any;
  success?: boolean;
}

type QueryFNProps = {
  token: string;
  url: string;
};

const queryFn = async ({ token, url }: QueryFNProps) => {
  try {
    if (!token) {
      return;
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const uri = `${apiBaseUrl}/${url}`;

    const response: ApiResponse = await axios.get(uri, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'application/json'
      }
    });
    if (response?.data === undefined) {
      return;
    } else if (response.status === 200) {
      return response.data;
    }
    return;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.code === 'ERR_NETWORK') {
        showToast(FailedToastTitle, error.message);
        return;
      }
      showToast(FailedToastTitle, error.response?.data.message);
      return;
    }
    showToast(FailedToastTitle, error.message, 'destructive');
    return;
  }
};

export function useCQuery({ queryKey, url, enabled = true }: CQueryProps) {
  const [cookies] = useCookies(['token']);
  const isEnableQuery: boolean = enabled && !!cookies?.token;
  const query = useQuery<ApiResponse, any, any, any>({
    queryKey: queryKey,
    enabled: isEnableQuery,
    refetchOnWindowFocus: true,
    networkMode: 'online',
    queryFn: async () =>
      await queryFn({
        token: cookies?.token,
        url: url
      })
  });

  useEffect(() => {
    if (query.isError) {
      showToast(SuccessToastTitle, query.error?.message);
    }
  }, [query.isError, query.error]);

  return {
    ...query
  };
}
