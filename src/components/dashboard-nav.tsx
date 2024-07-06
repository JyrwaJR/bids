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
import { AlertModal } from './modal/alert-modal';
import { Button } from './ui/button';

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
    if (setOpen) setOpen(!setOpen);
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
            <Button
              variant={'ghost'}
              onClickCapture={() => setIsAlertLogout(true)}
              type="button"
              className={cn(
                'flex items-center justify-start  overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                path === '/' ? 'bg-accent' : 'transparent',
                'p-0'
              )}
              onClick={() => {
                setIsAlertLogout(true);
              }}
            >
              <Icons.logout className={`ml-3 h-4`} />
              {isMobileNav || (!isMinimized && !isMobileNav) ? (
                <span className="mr-2 truncate">{'Logout'}</span>
              ) : (
                ''
              )}
            </Button>
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
        <AlertModal
          isOpen={isAlertLogout}
          onConfirm={() => logout()}
          onClose={() => setIsAlertLogout(false)}
          loading={false}
          desc="Are you sure you want to logout?"
          title="Logout"
        />
      )}
    </nav>
  );
}
