'use client';
import { batchFields } from '@constants/input-fields';
import { ProjectColumn, domainColumn } from '@constants/columns';
import { Checkbox } from '@components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Heading } from '@components/ui/heading';
import {
  BatchModel,
  BatchModelType,
  DomainModelType,
  ProjectModelType
} from '@src/models';
import React, { useState } from 'react';
import { useCQuery } from '@hooks/useCQuery';
import {
  batchQueryKey,
  domainQueryKey,
  projectsQueryKey,
  staffQueryKey
} from '@constants/query-keys';
import { DataTable } from '@components/ui/data-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { FailedToastTitle } from '@constants/toast-message';
import { showToast } from '@components/ui/show-toast';
import { Form } from '@components/index';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCMutation } from '@hooks/useCMutation';
import { FormFieldType, OptionsT } from '@components/form/type';
import { Separator } from '@components/ui/separator';
import { ScrollArea } from '@components/ui/scroll-area';
import { useRouter } from 'next/navigation';
interface ColType extends DomainModelType {
  id: string;
}
export default function Page() {
  const [selectedProjectIds, setSelectedIds] = useState<string>('');
  const [isSelectedDomainId, setSelectedDomainId] = useState<string>('');
  const router = useRouter();
  const form = useForm<BatchModelType>({
    resolver: zodResolver(BatchModel)
  });
  const { mutateAsync, isLoading } = useCMutation({
    url: 'batch/save',
    queryKey: batchQueryKey,
    method: 'POST'
  });

  const {
    data,
    isFetched,
    isError,
    isLoading: loading
  } = useCQuery({
    url: 'domain',
    queryKey: domainQueryKey
  });
  const {
    data: project,
    isFetched: projectIsFetching,
    isLoading: projectIsLoading,
    isError: projectIsError
  } = useCQuery({
    url: 'project',
    queryKey: projectsQueryKey
  });
  const staffQuery = useCQuery({
    url: 'staff',
    queryKey: staffQueryKey
  });
  const domainColumns: ColumnDef<DomainModelType>[] = [
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
              if (row.original.id !== isSelectedDomainId && row.original.id) {
                setSelectedDomainId(row.original.id);
              } else {
                setSelectedDomainId('');
              }
            } else {
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
  const projectColumns: ColumnDef<ProjectModelType>[] = [
    {
      id: 'select',
      header: () => <Checkbox disabled aria-label="Select all" />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.id === selectedProjectIds}
          onCheckedChange={(value) => {
            if (value) {
              row.getToggleSelectedHandler()(
                row.original.id === selectedProjectIds
              );
              if (row.original.id !== selectedProjectIds && row.original.id) {
                setSelectedIds(row.original.id);
              } else {
                setSelectedIds('');
              }
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

  const onSubmit: SubmitHandler<BatchModelType> = async (data) => {
    try {
      if (!selectedProjectIds) {
        showToast(FailedToastTitle, 'Please select project');
        return;
      }
      if (!isSelectedDomainId) {
        showToast(FailedToastTitle, 'Please select domain');
        return;
      }
      if (isSelectedDomainId && selectedProjectIds) {
        const res = await mutateAsync({
          ...data,
          project_id: selectedProjectIds,
          domain_id: isSelectedDomainId
        });
        if (res.success) {
          setSelectedIds('');
          setSelectedDomainId('');
          router.push('/dashboard/batch');
          return;
        }
      }
      showToast(
        FailedToastTitle,
        'Please select atleast one domain and project'
      );
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  const staffOptions: OptionsT[] =
    staffQuery.isFetched &&
    staffQuery.data &&
    !staffQuery.isLoading &&
    staffQuery.data?.data?.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }));

  const updateFields: FormFieldType[] = batchFields.map(
    (items: FormFieldType) => {
      if (items.select) {
        switch (items.name) {
          case 'trainer_id':
            return {
              ...items,
              options: staffQuery.isFetched ? staffOptions : []
            };
          case 'support_trainer_id':
            return {
              ...items,
              options: staffQuery.isFetched ? staffOptions : []
            };
          default:
            return items;
        }
      }
      return items;
    }
  );
  console.log(form.formState.errors);
  return (
    <div className="grid grid-cols-12 content-start gap-4">
      <div className="col-span-full pb-10">
        <Heading
          title="Create Batch"
          description="Select a Project and Domain to add a batch"
        />
      </div>

      {/* Project Table */}
      <div className="col-span-12 space-y-4 md:col-span-6">
        <Heading
          title="Project Table"
          description="Select a Project to add a batch"
        />
        <Separator />
        <ScrollArea className="h-96">
          <DataTable
            searchKey="name"
            enableSearch={false}
            className="h-full"
            isLoading={projectIsLoading}
            columns={projectColumns}
            data={
              projectIsFetching && !projectIsError && project.data
                ? project.data
                : []
            }
          />
        </ScrollArea>
      </div>

      {/* Domain Table */}
      <div className="col-span-12 space-y-4 md:col-span-6">
        <Heading
          title="Domain Table"
          description="Select a Domain to add a batch"
        />
        <Separator />
        <ScrollArea className="h-full md:h-96 ">
          {' '}
          {/* Added fixed height with scroll */}
          <DataTable
            searchKey="name"
            enableSearch={false}
            className="h-full"
            isLoading={loading}
            columns={domainColumns}
            data={isFetched && !isError ? data.data : []}
          />
        </ScrollArea>
      </div>

      {/* Form */}
      <div className="col-span-full">
        <Form
          form={form}
          onSubmit={onSubmit}
          className="sm:col-span-6 md:col-span-4"
          fields={updateFields}
          loading={isLoading || loading}
        />
      </div>
    </div>
  );
}
