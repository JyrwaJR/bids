import { OptionsT } from '@components/form/type';
import { FormFieldType } from '@components/index';
import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import {
  listStudentColumn,
  studentsColumn
} from '@constants/columns/students-column';
import {
  batchQueryKey,
  domainQueryKey,
  projectsQueryKey
} from '@constants/query-keys';
import { useCQuery } from '@hooks/useCQuery';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@components/ui/form';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBatch } from '@src/app/dashboard/registration/_lib/function';
import { useQuery } from 'react-query';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { Checkbox } from '@components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
const Model = z.object({
  project_id: z.string().uuid({
    message: 'Project is required'
  }),
  domain_id: z.string().uuid({
    message: 'Domain is required'
  }),
  batch_id: z.string().uuid({
    message: 'Batch is required'
  })
});

type Model = z.infer<typeof Model>;
export const StudentListPage = () => {
  const [isSelected, setIsSelected] = useState<string>('');
  const { options } = useCategorySelectOptions();
  const form = useForm<Model>({
    resolver: zodResolver(Model)
  });
  const watchProjectId = useWatch({
    control: form.control,
    name: 'project_id'
  });
  const watchDomainId = useWatch({
    control: form.control,
    name: 'domain_id'
  });
  const domainQuery = useCQuery({
    url: `project-domain/get-domain-by-project/${form.watch('project_id')}`,
    queryKey: [projectsQueryKey, domainQueryKey],
    enabled: !!watchProjectId
  });
  const mutate = useCMutation({
    method: 'POST',
    url: 'registration/list-student'
  });
  const batchQuery = useQuery({
    queryFn: async () => await getBatch(form.watch('project_id')),
    enabled: !!form.watch('project_id'),
    queryKey: [batchQueryKey, form.watch('project_id')]
  });
  const isDomainOptions: OptionsT[] = domainQuery.data?.data?.map(
    (item: any) => ({
      label: item.domain,
      value: item.domain_id
    })
  );
  const batchOptions: OptionsT[] =
    batchQuery.isFetched &&
    !batchQuery.isLoading &&
    !batchQuery.isError &&
    batchQuery.data &&
    batchQuery.data.data.map((item: { id: string; batch_code: string }) => ({
      label: item.batch_code,
      value: item.id
    }));
  const fields: FormFieldType[] = [
    {
      name: 'project_id',
      label: 'Domain',
      options: options.projects,
      select: true
    },
    {
      select: true,
      name: 'domain_id',
      readOnly: !!watchProjectId ? false : true || domainQuery.isLoading,
      label: 'Domain',
      options: isDomainOptions
    },
    {
      name: 'batch_id',
      label: 'Batch',
      readOnly:
        !!watchProjectId && !!watchDomainId
          ? false
          : true || domainQuery.isLoading,
      select: true,
      required: true,
      options: batchQuery.isFetched ? batchOptions : []
    }
  ];
  const onSubmit = async (data: Model) => {
    try {
      await mutate.mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message, 'destructive');
    }
  };

  const reFetchDomainOnChangeProject = useCallback(() => {
    if (watchProjectId) {
      domainQuery.refetch();
    }
  }, [watchProjectId]); // Only watching watchProjectId to trigger refetch
  const updateStatus = async () => {
    try {
      showToast('Success', 'Student Status Updated');
    } catch (error: any) {
      showToast(FailedToastTitle, error.message, 'destructive');
    }
  };
  useEffect(() => {
    reFetchDomainOnChangeProject();
  }, [watchProjectId, reFetchDomainOnChangeProject]); // watchProjectId ensures that refetch is only called when this value changes
  const column: ColumnDef<any>[] = [
    {
      id: 'select',
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onClick={async () => {
            if (row.original.id) {
              setIsSelected(row.original.id);
              if (isSelected) {
                await updateStatus();
              }
            }
          }}
        />
      )
    },
    ...studentsColumn
  ];
  return (
    <>
      <div className="flex-1 space-y-4">
        <Heading title={`List Student`} description="" />
        <Form {...form}>
          <form
            className="grid grid-cols-12 items-center gap-x-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {fields.map((input: FormFieldType, i) => (
              <div
                className="col-span-full content-center md:col-span-3"
                key={i}
              >
                <FormField
                  control={form.control}
                  disabled={input.readOnly}
                  name={input.name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{input.label}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger disabled={input.readOnly}>
                            <SelectValue
                              className="w-full min-w-[200px]"
                              placeholder="Select a value"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {input.options?.map((option: OptionsT, i: number) => (
                            <SelectItem value={option.value} key={i}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="col-span-full mt-5 flex h-full items-center justify-start md:col-span-3">
              <Button className="w-full md:w-auto">Search</Button>
            </div>
          </form>
        </Form>
        <Separator />
        <DataTable
          isLoading={mutate.isLoading}
          searchKey="full_name"
          columns={column}
          data={mutate.data?.data ?? []}
        />
      </div>
    </>
  );
};
