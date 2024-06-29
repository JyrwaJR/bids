import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { BatchColumn } from '@constants/columns/batch-column';
import React, { useState } from 'react';
import { AddBatch } from './add-batch';
import { useCQuery } from '@hooks/useCQuery';
import { isError } from 'react-query';
import { ScrollArea } from '@components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { ProjectColumn } from '@constants/columns';
import { Button } from '@components/ui/button';
import { Plus } from 'lucide-react';
import { Checkbox } from '@components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DomainModelType } from '@src/models';
interface ColType extends DomainModelType {
  id: string;
}
const BatchPage = () => {
  const [selectedIds, setSelectedIds] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isFetched, isLoading } = useCQuery({
    url: 'batch',
    queryKey: ['get', 'batch'],
    enabled: false
  });
  const {
    data: project,
    isFetched: projectIsFetching,
    isLoading: projectIsLoading,
    isError: projectIsError
  } = useCQuery({
    url: 'project',
    queryKey: ['get', 'project']
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
    <>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <Tabs defaultValue="batch" className="space-y-4">
            <TabsList>
              <TabsTrigger value="batch">Recent & Upcoming </TabsTrigger>
              <TabsTrigger value="new-batch">New Batch</TabsTrigger>
            </TabsList>
            <TabsContent value="batch" className="space-y-4">
              <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-start justify-between">
                  <Heading
                    title={`Batch`}
                    description="Manage ur Batch table"
                  />
                </div>
                <Separator />
                <DataTable
                  searchKey="name"
                  isLoading={isLoading}
                  columns={BatchColumn}
                  data={isFetched && !isError ? data.data : []}
                />
              </div>
            </TabsContent>
            <TabsContent value="new-batch" className="space-y-4">
              <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-start justify-between">
                  <Heading
                    title={`Project`}
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
                <Separator />
                <DataTable
                  searchKey="name"
                  isLoading={projectIsLoading}
                  columns={projectColumns}
                  data={
                    projectIsFetching && !projectIsError ? project.data : []
                  }
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {isOpen && (
        <AddBatch
          projectId={selectedIds}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default BatchPage;
