import { ColumnDef } from '@tanstack/react-table';
import { ProjectModelType } from '@src/models';

export const ProjectColumn: ColumnDef<ProjectModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Project'
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
  }
];
