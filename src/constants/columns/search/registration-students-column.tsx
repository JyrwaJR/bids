import { StudentRegistrationModelWithDomainType } from '@src/app/dashboard/registration/_lib/function';
import { ColumnDef } from '@tanstack/react-table';
export const searchRegistrationStudentColumn: ColumnDef<StudentRegistrationModelWithDomainType>[] =
  [
    {
      accessorKey: 'first_name',
      header: 'First Name',
      id: 'first_name'
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      id: 'last_name'
    },
    {
      accessorKey: 'registration_date',
      header: 'Date of Registration',
      id: 'dob'
    },
    {
      accessorKey: 'dob',
      header: 'Date of Birth',
      id: 'dob'
    },
    {
      accessorKey: 'email',
      header: 'Email',
      id: 'email'
    },
    {
      accessorKey: 'mobile',
      header: 'Mobile',
      id: 'mobile'
    }
  ];
