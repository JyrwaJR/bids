'use client';
import '@uploadthing/react/styles.css';
import './globals.css';

import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Toaster } from '@src/components/ui/toaster';
import { AuthProvider } from '@src/context/auth';
import ProtectedRoute from '@context/auth/protected-route';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  });

  // Prevent rendering on the server
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <AuthProvider>
            <ProtectedRoute>
              <NextTopLoader />
              <Toaster />
              {children}
            </ProtectedRoute>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
