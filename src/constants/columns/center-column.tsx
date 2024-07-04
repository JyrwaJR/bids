import { CenterModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';

export const CentreColumn: ColumnDef<CenterModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'contact',
    header: 'Phone No.'
  }
];
