import { DomainModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
export const domainColumn: ColumnDef<DomainModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Domain'
  },
  {
    accessorKey: 'sector',
    header: 'Sector'
  },
  {
    accessorKey: 'level',
    header: 'Level'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  }
];
