'use client';
import '@uploadthing/react/styles.css';
import './globals.css';

import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import ThemeProvider from '@/src/components/layout/ThemeToggle/theme-provider';
import { Toaster } from '@/src/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <NextTopLoader />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
