import React from 'react';

import { Icons } from '@src/components/icons';
import { FormFieldType } from '@components/index';
export type StepsFieldFormT = {
  name: string;
  fields: FormFieldType[];
};

export type TopNavLinksType = {
  title: string;
  href: string;
  disabled?: boolean;
  tooltip?: string;
  external?: boolean;
};
export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface Props {
  children: React.ReactNode;
}
