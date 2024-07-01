'use client';
import { ScrollArea } from '@components/ui/scroll-area';
import Header from '@src/components/layout/header';
import Sidebar from '@src/components/layout/sidebar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <ScrollArea className="flex-1 pt-16">{children}</ScrollArea>
      </div>
    </>
  );
}
