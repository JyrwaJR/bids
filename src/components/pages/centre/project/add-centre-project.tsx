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
import { FailedToastTitle } from '@constants/toast-message';
import { useCMutation } from '@hooks/useCMutation';
import { useCQuery } from '@hooks/useCQuery';
import { DomainModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@components/ui/form';
import { OptionsT } from '@components/form/type';
import { useQuery } from 'react-query';
import { getDomainByCentreId } from '@src/app/dashboard/registration/_lib/function';
import { z } from 'zod';
import { FieldsIsRequired } from '@constants/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Label } from '@components/ui/label';
import {
  centreQueryKey,
  domainQueryKey,
  projectsQueryKey
} from '@constants/query-keys';
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
    .uuid(),
  domain_id: z.string().uuid().array(),
  project_id: z.string().uuid()
});
type schemaType = z.infer<typeof schema>;
const AddCentreProject = ({ onClose, open, projectId }: Props) => {
  const [isSelectedCenterId, setIsSelectedCenterId] = useState<string>('');
  const [isSelectedDomainId, setIsSelectedDomainId] = useState<string[]>([]);
  const form = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      centre_id: isSelectedCenterId,
      domain_id: isSelectedDomainId,
      project_id: projectId
    }
  });

  const center = useCQuery({
    url: 'centre',
    queryKey: centreQueryKey
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
    queryKey: [domainQueryKey, centreQueryKey, isSelectedCenterId],
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
      setIsSelectedDomainId([]);
    }
  }, [form, isSelectedCenterId, refetchDomainQuery, setIsSelectedCenterId]);

  useEffect(() => {
    handleCentreIdChange();
  }, [handleCentreIdChange]);
  useEffect(() => {
    setIsSelectedDomainId([]);
    setIsSelectedCenterId('');
  }, []);
  const domainCol: ColumnDef<DomType | any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const rows = table.getRowModel().rows;
            if (value) {
              const ids = rows.map((row) => row.original.id);
              console.log('Selected Ids', ids);
              setIsSelectedDomainId([...ids]);
            } else {
              setIsSelectedDomainId([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={isSelectedDomainId.includes(row.original.id)}
          onCheckedChange={() => {
            const id = row.original.id;
            if (!isSelectedDomainId.includes(id)) {
              setIsSelectedDomainId([...isSelectedDomainId, id]);
            } else {
              const ids = isSelectedDomainId.filter(
                (selectedId) => selectedId !== id
              );
              setIsSelectedDomainId(ids);
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'domain',
      header: () => 'Domain'
    },
    {
      accessorKey: 'centre',
      header: () => 'Centre Name'
    },

    {
      accessorKey: 'status',
      header: () => 'Status'
    }
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

  const { mutateAsync, isLoading } = useCMutation({
    url: 'project-centre/save',
    method: 'POST',
    queryKey: [centreQueryKey, projectsQueryKey]
  });

  const onClickSubmit: SubmitHandler<schemaType> = async (data) => {
    try {
      if (isSelectedDomainId.length === 0) {
        showToast(FailedToastTitle, 'Please select domain');
        return;
      }
      const payload = {
        domain_id: isSelectedDomainId,
        centre_id: data.centre_id,
        project_id: data.project_id
      };
      await mutateAsync(payload);
    } catch (error) {
      showToast(FailedToastTitle, 'Something went wrong');
    } finally {
      setIsSelectedDomainId([]);
      setIsSelectedCenterId('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>Please select centre and domain</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onClickSubmit)}>
            <div className="space-y-2">
              <CForm
                form={form}
                fields={selectCenterFields}
                loading={isLoading}
              />
              <div className="space-y-2">
                <Label>Select Domain</Label>
                <DataTable
                  searchKey="domain"
                  className="max-h-[300px]"
                  columns={domainCol}
                  data={
                    domainQuery.isFetched &&
                    !domainQuery.isLoading &&
                    !domainQuery.isError &&
                    domainQuery.data?.data
                      ? domainQuery.data?.data
                      : []
                  }
                  isLoading={domainQuery.isLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant={'outline'} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isSelectedDomainId.length === 0}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCentreProject;
