import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { DataTable } from '@components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { domainColumn } from '@constants/columns';
import { FailedToastTitle } from '@constants/toast-message';
import { useCMutation } from '@hooks/useCMutation';
import { useCQuery } from '@hooks/useCQuery';
import { CenterModelType, DomainModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};
interface DomType extends DomainModelType {
  id: string;
}
interface CenType extends CenterModelType {
  id: string;
}

const AddCentreProject = ({ onClose, open, projectId }: Props) => {
  const [isSelectedCenterId, setIsSelectedCenterId] = useState<string>('');
  const [isSelectedDomainId, setIsSelectedDomainId] = useState<string[]>([]);
  const {
    data: center,
    isFetched: centerIsFetched,
    isLoading: centerIsLoading,
    isError: centerIsError
  } = useCQuery({
    url: 'centre',
    queryKey: ['get', 'centre']
  });
  const {
    data: domain,
    isFetched: domainIsFetched,
    isLoading: domainIsLoading,
    isError: domainIsError
  } = useCQuery({
    url: 'domain',
    queryKey: ['get', 'domain']
  });

  const domainCol: ColumnDef<DomType | any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            table.toggleAllPageRowsSelected(!!value);
            const row = table.getRowModel().rows;
            if (value) {
              setIsSelectedDomainId(row.map((row) => row.original.id));
            } else {
              setIsSelectedDomainId([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (value) {
              row.getToggleSelectedHandler()(!!value);
              setIsSelectedDomainId([...isSelectedDomainId, row.original.id]);
            } else {
              row.getToggleSelectedHandler()(!!value);
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    ...domainColumn
  ];
  const centreCol: ColumnDef<CenType | any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          disabled
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.id === isSelectedCenterId}
          onCheckedChange={(value) => {
            if (value) {
              row.getToggleSelectedHandler()(!!value);
              setIsSelectedCenterId(row.original.id);
            } else {
              row.getToggleSelectedHandler()(!!value);
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: 'Name'
    }
  ];
  const { mutateAsync, isSuccess, isLoading } = useCMutation({
    url: 'project-centre/save',
    method: 'POST',
    queryKey: ['get', 'centre']
  });
  const onClickAddProject = async () => {
    try {
      const data = {
        centre_id: isSelectedCenterId,
        project_id: projectId,
        domain_id: isSelectedDomainId
      };
      await mutateAsync(data).then((val) => {
        if (isSuccess) {
          showToast('Success', 'Project added successfully');
          onClose();
        }
      });
    } catch (error) {
      showToast(FailedToastTitle, 'Something went wrong');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {!!isSelectedCenterId ? 'Select Domain' : 'Select Centre'}
          </DialogTitle>
          <DialogDescription>
            Please select {isSelectedCenterId ? 'Domain' : 'Centre'}
          </DialogDescription>
        </DialogHeader>
        {!!isSelectedCenterId ? (
          <>
            <DialogDescription>
              {!!isSelectedCenterId ? 'Domain' : 'Centre'}
            </DialogDescription>
            <DataTable
              searchKey="name"
              columns={domainCol}
              data={
                !domainIsLoading && !domainIsError && domainIsFetched
                  ? domain.data
                  : []
              }
              isLoading={domainIsLoading}
            />
          </>
        ) : (
          <DataTable
            searchKey="name"
            columns={centreCol}
            data={
              !centerIsLoading && !centerIsError && centerIsFetched
                ? center.data
                : []
            }
            isLoading={centerIsLoading}
          />
        )}

        <DialogFooter>
          <Button variant={'outline'} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={
              (!!isSelectedCenterId && isSelectedDomainId.length === 0) ||
              isLoading
            }
            onClick={onClickAddProject}
          >
            Add Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCentreProject;
