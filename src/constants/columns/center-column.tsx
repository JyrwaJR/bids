import { CenterModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '../../components/tables/employee-tables/cell-action';

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
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    }
  }
];
