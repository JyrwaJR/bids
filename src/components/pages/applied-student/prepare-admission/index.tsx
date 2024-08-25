import { Heading } from '@components/ui/heading';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@components/ui/form';
import { Separator } from '@components/ui/separator';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { StudentRegistrationModelType } from '@models/student';
import { useCMutation } from '@hooks/useCMutation';
import { FormFieldType } from '@components/form';
import { Button } from '@components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OptionsT } from '@components/form/type';
import { FailedToastTitle } from '@constants/toast-message';
import { showToast } from '@components/ui/show-toast';
import { useCQuery } from '@hooks/useCQuery';
import { z } from 'zod';
import { useAppliedStudentsStore } from '@lib/store';
import {
  appliedApplicantQueryKey,
  domainQueryKey,
  projectsQueryKey
} from '@constants/query-keys';
import { addmissionColumn } from '@constants/columns/admission-column';
import { Checkbox } from '@components/ui/checkbox';
import { FieldsIsRequired } from '@constants/index';

const Model = z.object({
  project_id: z.string({ required_error: FieldsIsRequired }).uuid({
    message: FieldsIsRequired
  }),
  domain_id: z.string({ required_error: FieldsIsRequired }).uuid({
    message: FieldsIsRequired
  }),
  status: z.string({ required_error: FieldsIsRequired })
});

type Model = z.infer<typeof Model>;

const emptyOptions: OptionsT[] = [
  {
    label: 'N/A',
    value: ''
  }
];
const PrepareAdmissionList = () => {
  const { setId, id } = useAppliedStudentsStore();
  const [isSelectedProjectId, setIsSelectedProjectId] = useState('');
  const form = useForm<Model>({
    resolver: zodResolver(Model)
  });
  const project_id = useWatch({
    control: form.control,
    name: 'project_id'
  });
  const { data, refetch } = useCQuery({
    url: 'registration/candidate-registration-list',
    queryKey: appliedApplicantQueryKey
  });

  const projectQuery = useCQuery({
    url: 'project',
    queryKey: projectsQueryKey
  });

  const domainQuery = useCQuery({
    url: `project-domain/get-domain-by-project/${form.watch('project_id')}`,
    queryKey: [projectsQueryKey, domainQueryKey],
    enabled: !!form.watch('project_id')
  });

  const isProjectOptions: OptionsT[] = projectQuery.data?.data?.map(
    (item: any) => ({
      label: item.name,
      value: item.id
    })
  );

  const isDomainOptions: OptionsT[] = domainQuery.data?.data?.map(
    (item: any) => ({
      label: item.domain,
      value: item.domain_id
    })
  );

  const url: string = `registration/update-candidate-registration-status/${id}`;
  const mutate = useCMutation({
    url: url,
    method: 'PUT',
    queryKey: appliedApplicantQueryKey
  });

  const formFields: FormFieldType[] = [
    {
      name: 'project_id',
      label: 'Project Name',
      select: true,
      options: isProjectOptions ?? emptyOptions
    },
    {
      name: 'domain_id',
      label: 'Domain Name',
      select: true,
      readOnly: form.getValues('project_id') ? false : true,
      options: isDomainOptions ?? emptyOptions
    }
  ];

  async function updateStudentStatus() {
    try {
      form.trigger();
      if (!form.formState.isValid) {
        return;
      }
      await mutate.mutateAsync({
        status: 'Selected',
        project_id: form.getValues('project_id'),
        domain_id: form.getValues('domain_id')
      });
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    } finally {
      refetch();
    }
  }

  useEffect(() => {
    if (project_id && project_id !== isSelectedProjectId) {
      setIsSelectedProjectId(project_id);
      domainQuery.refetch();
    }
  }, [project_id, isSelectedProjectId, domainQuery]);

  const columns: ColumnDef<StudentRegistrationModelType | any>[] = [
    {
      id: 'select',
      header: () => <Checkbox disabled aria-label="Select all" />,
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.original.status === 'Selected'}
            onClick={async () => {
              if (row.original.status === 'Applied') {
                setId(row.original.id);
                if (id) {
                  await updateStudentStatus();
                }
              }
            }}
            onCheckedChange={() => row.toggleSelected()}
          />
        );
      }
    },
    ...addmissionColumn
  ];
  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Prepare Admission`}
            description="Manage Applied Student"
          />
        </div>
        <Separator />
        <Form {...form}>
          <form className="grid grid-cols-12 gap-x-2">
            {formFields.map((input, i) => (
              <div className="col-span-12 md:col-span-6" key={i}>
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select a value" />
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
          </form>
        </Form>
        <Separator />
        <DataTable
          searchKey="name"
          columns={columns}
          data={data?.data ? data.data : []}
        />
      </div>
    </>
  );
};

export default PrepareAdmissionList;
