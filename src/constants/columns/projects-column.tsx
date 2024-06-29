import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '../../components/tables/employee-tables/cell-action';
import { ProjectModelType } from '@src/models';

export const ProjectColumn: ColumnDef<ProjectModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'target',
    header: 'Target'
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
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'duration',
    header: 'Duration'
  },
  {
    accessorKey: 'target_sector',
    header: 'Target Sector'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    }
  }
];
