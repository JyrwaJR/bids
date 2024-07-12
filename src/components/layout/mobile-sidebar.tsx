'use client';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';

import { DashboardNav } from '@src/components/dashboard-nav';
import { Sheet, SheetContent, SheetTrigger } from '@src/components/ui/sheet';
import { navItems } from '@src/constants';
import { cn } from '@lib/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className={cn(className, '!px-0')}>
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {process.env.NEXT_PUBLIC_LOGO}
              </h2>
              <div className="space-y-1">
                <DashboardNav
                  items={navItems}
                  isMobileNav={open}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
