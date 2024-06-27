'use client';
import '@uploadthing/react/styles.css';
import './globals.css';

import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { Toaster } from '@src/components/ui/toaster';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '@src/context/auth';
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <AuthProvider>
            <NextTopLoader />
            <Toaster />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
