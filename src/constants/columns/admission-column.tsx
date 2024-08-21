import { StudentRegistrationModelType } from '@models/student';
import { ColumnDef } from '@tanstack/react-table';
export const addmissionColumn: ColumnDef<StudentRegistrationModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'dob',
    header: 'Date of Birth'
  },
  {
    accessorKey: 'gender',
    header: 'Gender'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  }
];
