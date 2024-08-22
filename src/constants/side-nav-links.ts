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
        icon: 'award',
        label: 'centre'
      },
      {
        title: 'Domain',
        icon: 'help',
        label: 'domain',
        items: [
          {
            title: 'List Domain',
            href: '/dashboard/domain',
            icon: 'media',
            label: 'Domain'
          },
          {
            title: 'Assign Domain',
            href: '/dashboard/domain/assign',
            icon: 'media',
            label: 'Assign Domain'
          }
        ]
      },
      {
        title: 'Project',
        href: '/dashboard/projects',
        icon: 'kanban',
        label: 'project',
        items: [
          {
            title: 'Existing Projects',
            href: '/dashboard/projects',
            icon: 'post',
            label: 'Project'
          },
          {
            title: 'Add Projects',
            href: '/dashboard/projects/add-project',
            icon: 'post',
            label: 'Project'
          },
          {
            title: 'Assign Projects',
            href: '/dashboard/projects/assign',
            icon: 'post',
            label: 'Assign Project'
          }
        ]
      },
      {
        title: 'Batch',
        href: '/dashboard/batch',
        icon: 'employee',
        label: 'batch',
        items: [
          {
            title: 'List Batch',
            href: '/dashboard/batch',
            icon: 'employee',
            label: 'batch'
          },
          {
            title: 'Assign Trainer',
            href: '/dashboard/batch/assign/teacher',
            icon: 'employee',
            disabled: true,
            label: 'add batch'
          }
        ]
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
    title: 'Search Student',
    href: '/dashboard/search?q=applicants',
    icon: 'search',
    label: 'search'
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
    title: 'Admission',
    icon: 'chevronRight',
    label: 'registration',
    items: [
      {
        title: 'Prepare Admission List ',
        href: '/dashboard/admission/prepare?status=Applied',
        icon: 'user',
        label: 'applied applicants'
      },
      {
        title: 'View Selected Candidates',
        href: '/dashboard/admission/selected?status=Selected',
        icon: 'user',
        label: 'selected applicants'
      },
      {
        title: 'Admit Students',
        href: '/dashboard/admission/admit?status=selected',
        icon: 'user',
        label: 'remove applicants'
      },
      {
        title: 'Remove Admit Candidates',
        href: '/dashboard/admission/remove?status=selected',
        icon: 'user',
        label: 'remove applicants'
      }
    ]
  },
  {
    title: 'Attendance',
    icon: 'employee',
    label: 'Attendance',
    items: [
      {
        title: 'List Attendance',
        href: '/dashboard/attendance',
        icon: 'employee',
        label: 'Attendance'
      },
      {
        title: 'Map Student',
        href: '/dashboard/attendance',
        icon: 'sun',
        label: 'Attendance'
      },
      {
        title: 'Upload Attendance',
        href: '/dashboard/attendance/new',
        icon: 'upload',
        label: 'Add Attendance'
      }
    ]
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
        title: 'Batch',
        href: '/dashboard/reports?reports=batch',
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
        href: '/dashboard/reports?reports=admission',
        icon: 'post',
        disabled: true,
        label: 'No. applicants reports'
      }
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
