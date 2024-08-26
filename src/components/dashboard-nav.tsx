'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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
import { AlertModal } from './modal/alert-modal';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible';

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
  const { onLogout, user } = useAuthContext();
  const path = usePathname();
  const { isMinimized, toggle } = useSidebar();
  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);
  const [openSecSubMenuId, setOpenSecSubMenuId] = useState<string | null>(null);
  const [isAlertLogout, setIsAlertLogout] = useState(false);

  useEffect(() => {
    if (isMinimized) setOpenSubMenuId(null);
  }, [isMinimized]);
  const userRole = user?.role;
  const excludeTitles = {
    mobilizer: ['admin', 'batch', 'staff', 'settings', 'project'],
    trainer: ['admin', 'staff', 'settings', 'project'],
    director: ['staff', 'project', 'search student', 'batch', 'attendance'],
    coordinator: ['staff', 'project', 'batch', 'students', 'attendance'],
    superadmin: ['project', 'batch']
  };

  const filteredNavItems = items.filter((item) => {
    // Ensure userRole is a valid string and fallback to 'mobilizer' if not a valid role
    const role =
      //@ts-ignore
      typeof userRole === 'string' && excludeTitles[userRole]
        ? userRole
        : 'mobilizer';

    // @ts-ignore
    const titlesToExclude = excludeTitles[role] || [];

    return !titlesToExclude.includes(item.title.toLowerCase()); // Return true if the title is not in the exclusion list
  });

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
        {filteredNavItems.map((item, index) => {
          const itemId = item.title || index.toString();
          const Icon = Icons[item.icon || 'arrowRight'];
          return (
            item && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  {item.items && item.items?.length > 0 ? (
                    <Collapsible
                      key={index}
                      open={openSubMenuId === item.title}
                      onOpenChange={() => {
                        setOpenSubMenuId(
                          openSubMenuId === itemId ? null : itemId
                        );
                        if (isMinimized && toggle) toggle();
                        if (isMinimized && openSubMenuId === item.title)
                          setOpenSubMenuId(null);
                      }}
                      className="w-full space-y-2 "
                    >
                      <CollapsibleTrigger
                        asChild
                        className={cn(
                          'flex w-full items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                          path === item.href ? 'bg-accent' : 'transparent',
                          item.disabled && 'cursor-not-allowed opacity-80'
                        )}
                      >
                        <div className="flex w-full justify-between px-3">
                          <div className="flex space-x-2">
                            <Icon className="size-5" />
                            {isMobileNav || (!isMinimized && !isMobileNav) ? (
                              <span className="mr-2 truncate">
                                {item.title}
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                          <>
                            {openSubMenuId === item.title ? (
                              <ChevronUp
                                className={
                                  isMinimized ? 'block md:hidden' : 'size-5'
                                }
                              />
                            ) : (
                              <ChevronDown
                                className={
                                  isMinimized ? 'block md:hidden' : 'size-5'
                                }
                              />
                            )}
                          </>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 pl-5">
                        {item.items?.map((subItem, index) => {
                          const SubIcon = Icons[subItem.icon!];

                          return subItem.items && subItem.items.length > 0 ? (
                            <Collapsible
                              key={index}
                              open={openSecSubMenuId === subItem.title}
                              onOpenChange={() => {
                                if (openSecSubMenuId === subItem.title) {
                                  // Close the current sub-submenu
                                  setOpenSecSubMenuId(null);
                                } else {
                                  // Open new sub-submenu
                                  setOpenSecSubMenuId(subItem.title);
                                }

                                // Handle toggle for minimized state
                                if (isMinimized && toggle) toggle();
                              }}
                              className="w-full space-y-2"
                            >
                              <CollapsibleTrigger asChild>
                                <div
                                  className={cn(
                                    'flex items-center justify-between gap-2 overflow-hidden rounded-md py-2 pr-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                    path === subItem.href
                                      ? 'bg-accent'
                                      : 'transparent',
                                    subItem.disabled &&
                                      'cursor-not-allowed opacity-80'
                                  )}
                                >
                                  <div className="flex space-x-2">
                                    <SubIcon className="ml-3 size-5" />
                                    {isMobileNav ||
                                    (!isMinimized && !isMobileNav) ? (
                                      <span className="mr-2 truncate">
                                        {subItem.title}
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                  {openSecSubMenuId === item.title ? (
                                    <ChevronUp
                                      className={
                                        isMinimized
                                          ? 'block md:hidden'
                                          : 'size-5'
                                      }
                                    />
                                  ) : (
                                    <ChevronDown
                                      className={
                                        isMinimized
                                          ? 'block md:hidden'
                                          : 'size-5'
                                      }
                                    />
                                  )}
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="space-y-2 pl-5">
                                {subItem.items.map(
                                  (nestedItem, nestedIndex) => {
                                    const NestedIcon = Icons[nestedItem.icon!];
                                    return (
                                      <Link
                                        key={nestedIndex}
                                        href={
                                          nestedItem.disabled
                                            ? '/dashboard'
                                            : nestedItem.href ?? ''
                                        }
                                        aria-disabled={nestedItem.disabled}
                                        className={cn(
                                          'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                          path === nestedItem.href
                                            ? 'bg-accent'
                                            : 'transparent',
                                          nestedItem.disabled &&
                                            'cursor-not-allowed opacity-80'
                                        )}
                                      >
                                        <NestedIcon className="ml-3 size-5" />
                                        {isMobileNav ||
                                        (!isMinimized && !isMobileNav) ? (
                                          <span className="mr-2 truncate">
                                            {nestedItem.title}
                                          </span>
                                        ) : (
                                          ''
                                        )}
                                      </Link>
                                    );
                                  }
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          ) : (
                            <Link
                              key={index}
                              href={
                                subItem.disabled
                                  ? '/dashboard'
                                  : subItem.href ?? ''
                              }
                              aria-disabled={subItem.disabled}
                              className={cn(
                                'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                path === subItem.href
                                  ? 'bg-accent'
                                  : 'transparent',
                                subItem.disabled &&
                                  'cursor-not-allowed opacity-80'
                              )}
                            >
                              <SubIcon className="ml-3 size-5" />
                              {isMobileNav || (!isMinimized && !isMobileNav) ? (
                                <span className="mr-2 truncate">
                                  {subItem.title}
                                </span>
                              ) : (
                                ''
                              )}
                            </Link>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      href={item.disabled ? '/' : item.href ?? ''}
                      target={item.external ? '_blank' : '_self'}
                      className={cn(
                        'flex items-center justify-between gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                        path === item.href ? 'bg-accent' : 'transparent',
                        item.disabled && 'cursor-not-allowed opacity-80'
                      )}
                      onClick={() => {
                        if (setOpen) setOpen(false);
                      }}
                    >
                      <div className="flex space-x-2">
                        <Icon className={`ml-3 size-5`} />
                        {isMobileNav || (!isMinimized && !isMobileNav) ? (
                          <span className="mr-2 truncate">{item.title}</span>
                        ) : (
                          ''
                        )}
                      </div>
                      {item.external && (
                        <Icons.external className="ml-3 size-5" />
                      )}
                    </Link>
                  )}
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
              variant="destructive"
              onClickCapture={() => setIsAlertLogout(true)}
              type="button"
              className={cn(
                'flex items-center justify-start  overflow-hidden rounded-md py-2 text-sm font-medium',
                path === '/' ? 'bg-accent' : 'transparent',
                'p-0'
              )}
              onClick={() => {
                setIsAlertLogout(true);
              }}
            >
              <Icons.logout className={`ml-3 h-4`} />
              {isMobileNav || (!isMinimized && !isMobileNav) ? (
                <span className="ml-2 mr-4 truncate">{'Logout'}</span>
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
