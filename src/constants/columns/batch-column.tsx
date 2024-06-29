import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@components/tables/employee-tables/cell-action';
import { BatchModelType } from '@src/models/batch-model';

export const BatchColumn: ColumnDef<BatchModelType>[] = [
  {
    accessorKey: 'batch_code',
    header: 'Batch Code'
  },
  {
    accessorKey: 'batchid',
    header: 'Batch ID'
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date'
  },
  {
    accessorKey: 'end_date',
    header: 'End Date'
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    }
  }
];
