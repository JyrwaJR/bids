import { Form } from '@components/form';
import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { DataTable } from '@components/ui/data-table';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { domainColumn } from '@constants/columns';
import { batchFields } from '@constants/input-fields';
import { batchQueryKey, domainQueryKey } from '@constants/query-keys';
import { FailedToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { useCQuery } from '@hooks/useCQuery';
import { BatchModel, BatchModelType, DomainModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};
interface ColType extends DomainModelType {
  id: string;
}
export const AddBatch = ({ open, onClose, projectId }: Props) => {
  const [isSelectedDomainId, setSelectedDomainId] = useState<string>('');
  const [isSelectedDomain, setSelectedDomain] = useState<boolean>(false);
  const form = useForm<BatchModelType>({
    resolver: zodResolver(BatchModel),
    defaultValues: {
      domain_id: isSelectedDomainId,
      project_id: projectId
    }
  });
  const { mutateAsync, isLoading } = useCMutation({
    url: 'batch/save',
    queryKey: batchQueryKey,
    method: 'POST'
  });
  const onSubmit: SubmitHandler<BatchModelType> = async (data) => {
    try {
      if (projectId.length === 0) {
        onClose();
        showToast(FailedToastTitle, 'Please select domain');
        return;
      }
      if (isSelectedDomain && projectId.length > 0) {
        await mutateAsync(data);
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    } finally {
      onClose();
    }
  };
  useEffect(() => {
    if (isSelectedDomainId.length > 0) {
      form.setValue('domain_id', isSelectedDomainId);
    }
  }, [isSelectedDomainId, form]);

  const {
    data,
    isFetched,
    isError,
    isLoading: loading
  } = useCQuery({
    url: 'domain',
    queryKey: domainQueryKey
  });
  const column: ColumnDef<ColType | any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          disabled
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.id === isSelectedDomainId}
          onCheckedChange={(value) => {
            if (value) {
              row.getToggleSelectedHandler()(!!value);
              setSelectedDomainId(row.original.id);
              setSelectedDomain(!!value);
            } else {
              row.getToggleSelectedHandler()(!!value);
              setSelectedDomainId('');
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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSelectedDomain ? 'Add Batch' : 'Select Domain'}
          </DialogTitle>
          <DialogDescription>
            {isSelectedDomain ? 'Add Batch' : 'Select Domain to add batch'}
          </DialogDescription>
        </DialogHeader>
        {isSelectedDomainId.length > 0 && isSelectedDomain ? (
          <Form
            form={form}
            onSubmit={onSubmit}
            className="md:col-span-6"
            fields={batchFields}
            loading={isLoading || loading}
            btnStyle="md:w-full"
          />
        ) : (
          <>
            <DataTable
              data={isFetched && !isError ? data.data : []}
              searchKey="name"
              columns={column}
              isLoading={loading}
            />
            <Button
              disabled={loading || isLoading || isSelectedDomainId.length === 0}
              onClick={() => setSelectedDomain(true)}
            >
              Done
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
