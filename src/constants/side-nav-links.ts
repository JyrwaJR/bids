import { NavItem } from '@src/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Test Page',
    href: '/dashboard/testing',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Admin',
    icon: 'add',
    label: 'centre',
    items: [
      {
        title: 'Project',
        href: '/dashboard/projects',
        icon: 'kanban',
        label: 'project'
      },
      {
        title: 'Centre',
        href: '/dashboard/centre',
        icon: 'add',
        label: 'centre'
      },
      {
        title: 'Domain',
        href: '/dashboard/domain',
        icon: 'user',
        label: 'domain'
      },
      {
        title: 'Batch',
        href: '/dashboard/batch',
        icon: 'employee',
        label: 'batch'
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
    title: 'Events',
    icon: 'sun',
    href: '/dashboard/events',
    label: 'events management'
  },
  {
    title: 'Search',
    icon: 'search',
    label: 'search',
    items: [
      {
        title: 'Applicants',
        href: '/dashboard/search?q=applicants',
        icon: 'userSquare',
        label: 'search'
      },
      {
        title: 'Students',
        href: '/dashboard/search?q=students',
        icon: 'search',
        label: 'kanban'
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
    title: 'Batch',
    href: '/dashboard/batch',
    icon: 'employee',
    label: 'batch'
  },
  {
    title: 'Registration',
    icon: 'laptop',
    label: 'registration',
    description: 'Student Registration',
    items: [
      {
        title: 'Register Applicant',
        href: '/dashboard/registration',
        icon: 'profile',
        label: 'registration',
        description: 'Add New Student Details'
      },
      {
        title: 'Update Applicant',
        href: '/dashboard/registration/update',
        icon: 'settings',
        label: 'registration',
        description: 'Update Student Details'
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
    title: 'Reports',
    icon: 'media',
    label: 'registration',
    items: [
      {
        title: 'Project',
        href: '/dashboard/reports?reports=project',
        icon: 'add',
        label: 'Project Report'
      },
      {
        title: 'Centre',
        href: '/dashboard/reports?reports=centre',
        icon: 'sun',
        label: 'Centre Report'
      },
      {
        title: 'Domain',
        href: '/dashboard/reports?reports=domain',
        icon: 'help',
        label: 'Domian Report'
      },
      {
        title: 'Sectors',
        href: '/dashboard/reports?reports=sector',
        icon: 'logo',
        label: 'Domian Report'
      },
      {
        title: 'No. Applicants',
        href: '/dashboard/reports?reports=noofapplicants',
        icon: 'post',
        label: 'No. applicants reports'
      },
    ]
  },
  {
    title: 'Settings',
    icon: 'settings',
    label: 'settings',
    items: [
      {
        title: 'Sectors',
        href: '/dashboard/sectors',
        icon: 'ellipsis',
        label: 'sector'
      },
      {
        title: 'Staff Category',
        href: '/dashboard/staff-category',
        icon: 'login',
        label: 'staff category'
      }
    ]
  }
];
