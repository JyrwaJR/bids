import { Button } from '@components/ui/button';

import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React from 'react';
import { DataTable } from '@components/ui/data-table';
import { AddSector } from './add-sector';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@components/cell-action';
import { useSectorStore } from '@lib/store';
import { sectorQueryKey } from '@constants/query-keys';

export const SectorPage = () => {
  const { setId, onOpenChange, open } = useSectorStore();
  const { data, isFetched } = useCQuery({
    url: 'sector',
    queryKey: sectorQueryKey
  });
  const column: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'Action',
      cell: ({ row }) => (
        <CellAction
          onEdit={() => {
            if (row.original.id) {
              setId(row.original.id);
              onOpenChange(true);
            }
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false
    }
  ];
  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Sector`} description="Manage ur Sector table" />
          <Button
            className="text-xs md:text-sm"
            onClick={() => onOpenChange(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Sector
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={column}
          data={isFetched && data.data}
        />
      </div>
      {open && <AddSector />}
    </>
  );
};
