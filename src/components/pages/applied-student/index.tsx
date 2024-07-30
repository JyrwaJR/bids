import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { StudentRegistrationModelType } from '@models/student';
import { useCMutation } from '@hooks/useCMutation';
import { FormFieldType, Form } from '@components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OptionsT } from '@components/form/type';
import { FailedToastTitle } from '@constants/toast-message';
import { showToast } from '@components/ui/show-toast';
import { useCQuery } from '@hooks/useCQuery';
import { z } from 'zod';
import { UpdateAppliedStudentForm } from './update-applied-students';
import { useAppliedStudentsStore } from '@lib/store';
import {
  appliedApplicantQueryKey,
  domainQueryKey,
  projectsQueryKey
} from '@constants/query-keys';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  Form as FormTag
} from '@components/ui/form';
import { SaveIcon } from 'lucide-react';
import { Button } from '@components/ui/button';
const StudentStatusOptions: OptionsT[] = [
  {
    label: 'Applied',
    value: 'Applied'
  },
  {
    label: 'Selected',
    value: 'Selected'
  },
  {
    label: 'Waiting',
    value: 'Waiting'
  },
  {
    label: 'Rejected',
    value: 'Rejected'
  }
];

const AppliedStudentModel = z.object({
  project_id: z.string().uuid(),
  domain_id: z.string().uuid(),
  status: z.string()
});

type ModelType = z.infer<typeof AppliedStudentModel>;

const emptyOptions: OptionsT[] = [
  {
    label: 'N/A',
    value: ''
  }
];
const UpdateStudentSchema = z.object({
  status: z
    .string()
    .refine((value) => StudentStatusOptions.some((o) => o.value === value), {
      message: 'Please select a status'
    })
});
type UpdateStudentSchemaType = z.infer<typeof UpdateStudentSchema>;
const AppliedStudentPage = () => {
  const { setId, id } = useAppliedStudentsStore();
  const [isSelectedProjectId, setIsSelectedProjectId] = useState('');
  const form = useForm<ModelType>({
    resolver: zodResolver(AppliedStudentModel),
    defaultValues: {
      status: 'Applied'
    }
  });
  const updateForm = useForm<UpdateStudentSchemaType>({
    resolver: zodResolver(UpdateStudentSchema)
  });

  const { mutateAsync, isLoading, data,  } = useCMutation({
    method: 'POST',
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
      options: isProjectOptions
    },
    {
      name: 'domain_id',
      label: 'Domain Name',
      select: true,
      readOnly: form.getValues('project_id') ? false : true,
      options: isDomainOptions ?? emptyOptions
    },
    {
      name: 'status',
      label: 'Status',
      select: true,
      readOnly: form.getValues('project_id') ? false : true,
      options: StudentStatusOptions ?? emptyOptions
    }
  ];
  async function updateStudentStatus(status: string) {
    try {
      await mutate.mutateAsync({
        status: status
      });
    } catch (error: any) {
      showToast(FailedToastTitle, error.error);
    }finally{
      await mutateAsync({
        status:form.getValues('status'),
        project_id:form.getValues('project_id'),
        domain_id:form.getValues('domain_id')
      })
    }
  }
  const columns: ColumnDef<StudentRegistrationModelType | any>[] = [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'gender',
      header: 'Gender'
    },
    {
      accessorKey: 'email',
      header: 'Father'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <FormTag {...updateForm}>
              <FormField
                control={updateForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-28">
                    <Select
                      defaultValue={
                        row.original.id === id
                          ? updateForm.getValues('status')
                          : row.original.status
                      }
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {StudentStatusOptions.map(({ label, value }) => (
                            <SelectItem value={value}>{label}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </FormTag>
            <Button
              variant="outline"
              size={'icon'}
              onClick={async () => {
                setId(row.original.id);
                if (id)
                  await updateStudentStatus(updateForm.getValues('status'));
              }}
            >
              <SaveIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const onSubmit = async (data: ModelType) => {
    try {
      AppliedStudentModel.parse(data);
      await mutateAsync(data);
    } catch (error: any) {
      if (error instanceof Error) {
        showToast(FailedToastTitle, error.message);
      }
      if (error instanceof z.ZodError) {
        showToast(FailedToastTitle, error.errors[0].message);
        return;
      }
      showToast(FailedToastTitle, error.message);
      return;
    }
  };
  useEffect(() => {
    if (
      form.watch('project_id') &&
      form.watch('project_id') !== isSelectedProjectId
    ) {
      domainQuery.refetch();
      setIsSelectedProjectId(form.getValues('project_id'));
    }
  }, [form, domainQuery, isSelectedProjectId]);

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Applied Students`}
            description="Manage Applied Student"
          />
        </div>
        <Separator />
        <Form
          form={form}
          fields={formFields}
          loading={isLoading}
          onSubmit={onSubmit}
          className="sm:col-span-4 md:col-span-4"
          btnText="Search"
        />
        <Separator />
        <DataTable
          searchKey="first_name"
          columns={columns}
          data={data?.data ? data.data : []}
        />
      </div>
    </>
  );
};

export default AppliedStudentPage;
