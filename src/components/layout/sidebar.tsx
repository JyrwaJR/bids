'use client';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';

import { DashboardNav } from '@src/components/dashboard-nav';
import { navItems } from '@src/constants';
import { useSidebar } from '@src/hooks/useSidebar';
import { cn } from '@src/lib/utils';
import { ScrollArea } from '@components/ui/scroll-area';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none border-r pt-16 md:block`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <ScrollArea className="relative h-full space-y-1">
        <div className="space-y-1 px-4">
          <DashboardNav items={navItems} />
        </div>
      </ScrollArea>
    </nav>
  );
}
