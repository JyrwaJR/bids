'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

import { Icons } from '@src/components/icons';
import { useSidebar } from '@src/hooks/useSidebar';
import { cn } from '@src/lib/utils';
import { NavItem } from '@src/types';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';
import { useAuthContext } from '@context/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const { onLogout } = useAuthContext();
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const [isAlertLogout, setIsAlertLogout] = useState(false);
  if (!items?.length) {
    return null;
  }

  const logout = () => {
    onLogout();
    if (setOpen) setOpen(false);
  };

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.disabled ? '/' : item.href}
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      path === item.href ? 'bg-accent' : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <Icon className={`ml-3 size-5`} />

                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ''
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={''}
              onClickCapture={() => setIsAlertLogout(true)}
              className={cn(
                'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                path === '/' ? 'bg-accent' : 'transparent'
              )}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <Icons.logout className={`ml-3 size-5`} />

              {isMobileNav || (!isMinimized && !isMobileNav) ? (
                <span className="mr-2 truncate">{'Logout'}</span>
              ) : (
                ''
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent
            align="center"
            side="right"
            sideOffset={8}
            className={!isMinimized ? 'hidden' : 'inline-block'}
          >
            Logout
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isAlertLogout && (
        <AlertDialog open={isAlertLogout} onOpenChange={setIsAlertLogout}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will sign out your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertLogout(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </nav>
  );
}
