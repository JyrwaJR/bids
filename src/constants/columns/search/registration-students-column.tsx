import { StudentRegistrationModelWithDomainType } from '@src/app/dashboard/registration/_lib/function';
import { ColumnDef } from '@tanstack/react-table';
export const searchRegistrationStudentColumn: ColumnDef<StudentRegistrationModelWithDomainType>[] =
  [
    {
      accessorKey: 'full_name',
      header: 'Full Name'
    },
    {
      accessorKey: 'registration_no',
      header: 'Registration No.'
    },
    {
      accessorKey: 'dob',
      header: 'Date of Birth',
      id: 'dob'
    },
    {
      accessorKey: 'mobile',
      header: 'Mobile',
      id: 'mobile'
    }
  ];
