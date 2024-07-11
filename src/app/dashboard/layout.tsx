'use client';
import BreadCrumb from '@components/breadcrumb';
import { ScrollArea } from '@components/ui/scroll-area';
import Header from '@src/components/layout/header';
import Sidebar from '@src/components/layout/sidebar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const breadcrumbItems = [
    {
      title: pathName === '/dashboard' ? 'Home' : `${pathName.split('/')[2]}`,
      link: `${pathName === '/dashboard' ? '/dashboard' : pathName}`
    }
  ];
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <ScrollArea className="container flex-1 pt-16">
          <div className="py-5">
            <BreadCrumb items={breadcrumbItems} />
          </div>
          {children}
        </ScrollArea>
      </div>
    </>
  );
}
