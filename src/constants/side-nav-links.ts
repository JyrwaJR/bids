import { NavItem, NavItemWithOptionalChildren } from '@src/types';
import { NavItemWithChildren } from '../types/index';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Center',
    icon: 'add',
    label: 'centre',
    items: [
      {
        title: 'Centre',
        href: '/dashboard/centre',
        icon: 'add',
        label: 'centre'
      },
      {
        title: 'Batch',
        href: '/dashboard/batch',
        icon: 'employee',
        label: 'batch'
      },
      {
        title: 'Domain',
        href: '/dashboard/domain',
        icon: 'user',
        label: 'domain'
      },
      {
        title: 'Sector',
        href: '/dashboard/sector',
        icon: 'check',
        label: 'registration'
      },
      {
        title: 'Project',
        href: '/dashboard/projects',
        icon: 'kanban',
        label: 'project'
      }
    ]
  },
  {
    title: 'Staff',
    icon: 'billing',
    href: '/dashboard/staff',
    label: 'staff'
  },
  {
    title: 'Registration ',
    icon: 'laptop',
    label: 'registration',
    description: 'Student Registration',
    items: [
      {
        title: 'Apply Student',
        href: '/dashboard/registration',
        icon: 'profile',
        label: 'registration',

        description: 'Student Registration'
      },
      {
        title: 'Update Registration',
        href: '/dashboard/registration/update-registration',
        icon: 'settings',
        label: 'registration',

        description: 'Student Registration'
      }
    ]
  },
  {
    title: 'Applied Student',
    href: '/dashboard/applied-student',
    icon: 'chevronRight',
    label: 'registration'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'registration'
  }
];
