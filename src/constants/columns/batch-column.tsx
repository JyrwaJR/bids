import { BatchModelType } from '@models/batch-model';
import { ColumnDef } from '@tanstack/react-table';

export const BatchColumn: ColumnDef<BatchModelType>[] = [
  {
    accessorKey: 'batch_code',
    header: 'Batch Code'
  },
  {
    accessorKey: 'project',
    header: 'Project'
  },
  {
    accessorKey: 'domain',
    header: 'Domain'
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
  }
];
