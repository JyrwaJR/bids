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
    title: 'Project',
    href: '/dashboard/projects',
    icon: 'kanban',
    label: 'project'
  },
  {
    title: 'Batch',
    href: '/dashboard/batch',
    icon: 'chevronLeft',
    label: 'batch'
  },
  {
    title: 'Student Registration ',
    href: '/dashboard/registration',
    icon: 'chevronRight',
    label: 'registration'
  }
];
