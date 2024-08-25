import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { ProjectColumn } from '@constants/columns';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { ProjectModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@components/ui/checkbox';
import { projectsQueryKey } from '@constants/query-keys';
import AddCentreProject from './add-centre-project';
interface ColType extends ProjectModelType {
  id: string;
}
const CentreProjectPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSelectedProjectId, setIsSelectedProjectId] = useState<string>('');
  const { data, isFetched, isLoading, isError } = useCQuery({
    url: 'project',
    queryKey: projectsQueryKey
  });
  const column: ColumnDef<ColType | any>[] = [
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
          checked={row.original.id === isSelectedProjectId}
          onCheckedChange={(value) => {
            if (value) {
              row.getToggleSelectedHandler()(
                row.original.id === isSelectedProjectId
              );
              setIsSelectedProjectId(row.original.id);
            } else {
              row.getToggleSelectedHandler()(!!value);
              setIsSelectedProjectId('');
            }
          }}
          aria-label="Select row"
        />
      )
    },
    ...ProjectColumn
  ];
  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Assign Project to a Centre`}
            description="Please select the project to assign to a center"
          />
        </div>
        <Separator />
        <div className="flex justify-end">
          <Button
            onClick={() => setIsOpen(true)}
            disabled={isSelectedProjectId.length > 0 ? false : true}
          >
            <Plus className="mr-2 h-4 w-4" /> Assign Center
          </Button>
        </div>
        <DataTable
          searchKey="name"
          isLoading={isLoading}
          columns={column}
          data={isFetched && !isError ? data.data : []}
        />
      </div>
      {isOpen && (
        <AddCentreProject
          projectId={isSelectedProjectId}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default CentreProjectPage;
