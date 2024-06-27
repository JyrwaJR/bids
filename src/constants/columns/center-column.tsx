import { CenterModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@src/components/ui/checkbox';
import { CellAction } from '../../components/tables/employee-tables/cell-action';

export const CentreColumn: ColumnDef<CenterModelType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
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
