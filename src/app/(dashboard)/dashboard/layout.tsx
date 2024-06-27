'use client';
import { useAuthContext } from '@context/auth';
import Header from '@src/components/layout/header';
import Sidebar from '@src/components/layout/sidebar';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuthContext();
  const router = useRouter();
  if (!isLoggedIn) {
    router.push('/');
  }
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}
