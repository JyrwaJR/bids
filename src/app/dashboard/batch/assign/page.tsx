'use client';
import { Button } from '@components/ui/button';
import { ProjectColumn } from '@constants/columns';
import { Checkbox } from '@components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Heading } from '@components/ui/heading';
import { Plus } from 'lucide-react';
import { DomainModelType } from '@src/models';
import React, { useState } from 'react';
import { useCQuery } from '@hooks/useCQuery';
import { projectsQueryKey } from '@constants/query-keys';
import { DataTable } from '@components/ui/data-table';
import { AddBatch } from '@components/pages';
interface ColType extends DomainModelType {
  id: string;
}
export default function Page() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string>('');
  const {
    data: project,
    isFetched: projectIsFetching,
    isLoading: projectIsLoading,
    isError: projectIsError
  } = useCQuery({
    url: 'project',
    queryKey: projectsQueryKey
  });
  const projectColumns: ColumnDef<ColType | any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          disabled
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.id === selectedIds}
          onCheckedChange={(value) => {
            if (value) {
              row.getToggleSelectedHandler()(row.original.id === selectedIds);
              setSelectedIds(row.original.id);
            } else {
              row.getToggleSelectedHandler()(!!value);
              setSelectedIds('');
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    ...ProjectColumn
  ];
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-start justify-between">
        <Heading
          title={`Create Batch`}
          description="Select a Project to add a batch"
        />
        <Button
          className="text-xs md:text-sm"
          disabled={selectedIds.length === 0}
          onClick={() => setIsOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Batch
        </Button>
      </div>
      <DataTable
        searchKey="name"
        isLoading={projectIsLoading}
        columns={projectColumns}
        data={
          projectIsFetching && !projectIsError && project.data
            ? project.data
            : []
        }
      />
      {isOpen && (
        <AddBatch
          projectId={selectedIds}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
