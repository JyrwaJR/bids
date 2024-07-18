import { CForm } from '@components/form';
import { FormFieldType } from '@components/index';
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
import { DomainModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@components/ui/form';
import { OptionsT } from '@components/form/type';
import { useQuery } from 'react-query';
import { getDomainByCentreId } from '@src/app/dashboard/registration/_lib/function';
import { z } from 'zod';
import { FieldsIsRequired } from '@constants/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};
interface DomType extends DomainModelType {
  id: string;
}
const schema = z.object({
  centre_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid()
});
type schemaType = z.infer<typeof schema>;
const AddCentreProject = ({ onClose, open, projectId }: Props) => {
  const [isSelectedCenterId, setIsSelectedCenterId] = useState<string>('');
  const [isSelectedDomainId, setIsSelectedDomainId] = useState<string[]>([]);

  const form = useForm<schemaType>({
    resolver: zodResolver(schema)
  });

  const center = useCQuery({
    url: 'centre',
    queryKey: ['get', 'centre']
  });

  const centerOptions: OptionsT[] = center.data?.data?.map(
    (item: { name: string; id: string }) => ({
      label: item.name,
      value: item.id
    })
  );

  const domainQuery = useQuery({
    queryFn: async () => await getDomainByCentreId(isSelectedCenterId),
    enabled: !!isSelectedCenterId,
    queryKey: ['domain', 'centre_id', isSelectedCenterId],
    initialData: [],
    onError: (err: any) => {
      if (err instanceof AxiosError) {
        showToast(FailedToastTitle, err.response?.data.message);
        return;
      }
      showToast(FailedToastTitle, err.message);
      return;
    }
  });

  const refetchDomainQuery = useCallback(() => {
    domainQuery.refetch();
  }, [domainQuery]);

  const handleCentreIdChange = useCallback(() => {
    const currentProjectId = form.watch('centre_id');
    if (currentProjectId === undefined) return;
    if (currentProjectId !== isSelectedCenterId) {
      refetchDomainQuery();
      setIsSelectedCenterId(currentProjectId);
    }
  }, [form, isSelectedCenterId, refetchDomainQuery, setIsSelectedCenterId]);

  useEffect(() => {
    handleCentreIdChange();
  }, [handleCentreIdChange]);

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

  const selectCenterFields: FormFieldType[] = [
    {
      name: 'centre_id',
      label: 'Select Centre',
      options: centerOptions,
      select: true,
      required: true
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
          return;
        }
      });
    } catch (error) {
      showToast(FailedToastTitle, 'Something went wrong');
    } finally {
      setIsSelectedDomainId([]);
      setIsSelectedCenterId('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>Please select centre and domain</DialogDescription>
        </DialogHeader>
        <div className="max-h-[70%]">
          <Form {...form}>
            <CForm
              form={form}
              fields={selectCenterFields}
              loading={isLoading}
            />
          </Form>
          <DataTable
            searchKey="name"
            columns={domainCol}
            data={
              domainQuery.isFetched &&
              !domainQuery.isLoading &&
              !domainQuery.isError &&
              domainQuery.data?.data
            }
            isLoading={domainQuery.isLoading}
          />
        </div>
        <DialogFooter>
          <Button variant={'outline'} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={onClickAddProject}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCentreProject;
