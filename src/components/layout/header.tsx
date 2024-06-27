import Link from 'next/link';

import ThemeToggle from '@src/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@src/lib/utils';

import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import { Typography } from '@components/typography';

export default function Header() {
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={'/'} className="flex items-center space-x-2 ">
            <Typography size={'h2'} weight={'bold'} colors="primary">
              BIDS
            </Typography>
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
