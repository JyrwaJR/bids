import { StudentRegistrationModelType } from '@models/student';
import { ColumnDef } from '@tanstack/react-table';
export const addmissionColumn: ColumnDef<StudentRegistrationModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'father_name',
    header: 'Father Name'
  },
  {
    accessorKey: 'gender',
    header: 'Gender'
  },
  {
    accessorKey: 'mobile',
    header: 'Mobile'
  }
];
