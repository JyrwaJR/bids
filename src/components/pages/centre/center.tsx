import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { CentreColumn } from '@constants/columns';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React from 'react';
import { AddCentre } from './add-center';
import { useAuthContext } from '@context/auth';
import { CellAction } from '@components/cell-action';
import { ColumnDef } from '@tanstack/react-table';
import { CenterModelType } from '@models/center-model';
import { AlertModal } from '@components/modal/alert-modal';
import { useCenterStore } from '@lib/store';

export const CenterPageComponents = () => {
  const { id, setId, setIsDeleting, isDeleting, open, setOpen } =
    useCenterStore();
  const { user } = useAuthContext();
  const { data, isFetched, isLoading } = useCQuery({
    url: 'centre',
    queryKey: ['get', 'centre']
  });
  const column: ColumnDef<CenterModelType>[] = [
    ...CentreColumn,
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <CellAction
            onDelete={() => {
              if (row.original.id) {
                setId(row.original.id);
                setIsDeleting(true);
              }
            }}
          />
        );
      }
    }
  ];
  const onClickDelete = () => {
    if (isDeleting) {
      console.log(id);
      setIsDeleting(false);
    }
  };
  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Center`} description="Manage ur center table" />
          <Button
            disabled={!isFetched || !user?.role || user?.role !== 'superadmin'}
            className="text-xs md:text-sm"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          isLoading={isLoading}
          columns={column}
          data={isFetched ? data.data : []}
        />
      </div>
      {open && <AddCentre open={open} onClose={() => setOpen(false)} />}
      {isDeleting && (
        <AlertModal
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          title="Delete Center"
          desc="Are you sure you want to delete this center?"
          loading={!isDeleting}
          onConfirm={onClickDelete}
        />
      )}
    </>
  );
};
