import { ColumnDef } from '@tanstack/react-table';

export const sectorColumn: ColumnDef<any>[] = [
  {
    header: 'Sector',
    accessorKey: 'name'
  }
];
