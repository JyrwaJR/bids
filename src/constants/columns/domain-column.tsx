import { CellAction } from '@components/tables/employee-tables/cell-action';
import { DomainModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
export const domainColumn: ColumnDef<DomainModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'level',
    header: 'Level'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'Action',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
