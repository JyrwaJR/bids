import { DomainModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
export const domainColumn: ColumnDef<DomainModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Domain'
  },
  { accessorKey: 'level', header: 'Level' },
  { accessorKey: 'sector', header: 'Sector' },
  {
    accessorKey: 'status',
    header: 'Status'
  }
];
