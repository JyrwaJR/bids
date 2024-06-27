import { NavItem } from '@src/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Center',
    href: '/dashboard/centre',
    icon: 'add',
    label: 'centre'
  },
  {
    title: 'Staff',
    href: '/dashboard/staff',
    icon: 'billing',
    label: 'staff'
  },
  {
    title: 'Domain',
    href: '/dashboard/domain',
    icon: 'user',
    label: 'domain'
  },
  {
    title: 'Employee',
    href: '/dashboard/employee',
    icon: 'employee',
    label: 'employee'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile'
  },
  {
    title: 'Login',
    href: '/',
    icon: 'login',
    label: 'login'
  }
];
