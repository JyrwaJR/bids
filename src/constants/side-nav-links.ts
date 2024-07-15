import { NavItem } from '@src/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Admin',
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
        title: 'Add Student',
        href: '/dashboard/registration',
        icon: 'profile',
        label: 'registration',
        description: 'Add New Student Details'
      },
      {
        title: 'Update Student',
        href: '/dashboard/registration/update',
        icon: 'settings',
        label: 'registration',
        description: 'Update Student details'
      }
    ]
  },
  {
    title: 'Project',
    href: '/dashboard/projects',
    icon: 'chevronRight',
    label: 'registration'
  },
  {
    title: 'Applied Student',
    href: '/dashboard/applied-student',
    icon: 'chevronRight',
    label: 'registration'
  }
];
