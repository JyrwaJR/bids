import React, { useEffect, useState } from 'react';
import { FailedToastTitle } from '@constants/toast-message';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DomainModelType, ProjectModel, ProjectModelType } from '@src/models';
import { projectsFields } from '@constants/input-fields/projects/project-fields';
import { useCMutation } from '@hooks/useCMutation';
import { Checkbox } from '@components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { showToast } from '@components/ui/show-toast';
import { useCQuery } from '@hooks/useCQuery';
import { domainColumn } from '@constants/columns';
import { Heading } from '@components/ui/heading';
import { DataTable } from '@components/ui/data-table';
import { Separator } from '@components/ui/separator';
import { CForm, FormTag } from '@components/form';
import { Card } from '@components/ui/card';
import { projectsQueryKey } from '@constants/query-keys';
const AddNewProject = () => {
  const [isSelectedIds, setSelectedIds] = useState<string[]>([]);
  const form = useForm<ProjectModelType>({
    resolver: zodResolver(ProjectModel),
    defaultValues: {
      domain_id: isSelectedIds
    }
  });
  const {
    isLoading: isMutateLoading,
    isSuccess,
    mutateAsync,
    isError: isMutateError
  } = useCMutation({
    method: 'POST',
    url: 'project/save',
    queryKey: projectsQueryKey
  });

  const onSubmit: SubmitHandler<ProjectModelType> = async (data) => {
    try {
      const payload = ProjectModel.parse(data);
      if (isSelectedIds.length > 0) {
        await mutateAsync({ ...payload, domain_id: isSelectedIds });
        if (isSuccess && !isMutateError) {
          form.reset();
          setSelectedIds([]);
          return;
        }
        return;
      }
      showToast(FailedToastTitle, 'Please select domain to add projects');
      return;
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
      return;
    }
  };

  const {
    data: domain,
    isFetched: isDomainFetch,
    isError: isDomainError
  } = useCQuery({
    url: 'domain',
    queryKey: ['get', 'domain']
  });

  const columns: ColumnDef<DomainModelType | any>[] = [
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
              setSelectedIds(row.map((row) => row.original.id));
            } else {
              setSelectedIds([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={
            row.getIsSelected() || isSelectedIds.includes(row.original.id)
          }
          onCheckedChange={(value) => {
            if (value) {
              row.getToggleSelectedHandler()(!!value);
              setSelectedIds([...isSelectedIds, row.original.id]);
            } else {
              row.getToggleSelectedHandler()(!!value);
              setSelectedIds([
                ...isSelectedIds.filter((id) => id !== row.original.id)
              ]);
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

  const targetSector = form.watch('target_sector');

  const domainData = (() => {
    if (targetSector === 'Both') {
      // Filter for both 'Rural' and 'Urban'
      return domain?.data.filter(
        (item: any) => item.sector === 'Rural' || item.sector === 'Urban'
      );
    } else if (targetSector) {
      // Filter based on the selected target sector
      return domain?.data.filter((item: any) => item.sector === targetSector);
    }
    // Return all data if targetSector is falsy
    return domain?.data;
  })();

  return (
    <FormTag
      form={form}
      onSubmit={onSubmit}
      buttonTitle="Add Project"
      isLoading={isMutateLoading}
      className="space-y-4"
    >
      <Card className="space-y-2 p-2">
        <div className="flex items-start justify-between">
          <Heading
            title={`New Projects`}
            description="Please fill the fields to add a projects"
          />
        </div>
        <CForm
          form={form}
          fields={projectsFields}
          loading={isMutateLoading}
          className="md:col-span-6 lg:col-span-4"
        />
      </Card>
      <Separator />
      <Card className="space-y-2 p-2">
        <div className="flex items-start justify-between">
          <Heading
            title={`List of Domains`}
            description="Please select a domain to add projects"
          />
        </div>
        <DataTable
          searchKey="name"
          data={isDomainFetch && !isDomainError ? domainData : []}
          columns={columns}
          className="h-96"
        />
      </Card>
    </FormTag>
  );
};

export default AddNewProject;
