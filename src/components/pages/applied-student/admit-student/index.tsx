import { Separator } from '@components/ui/separator';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { StudentRegistrationModelType } from '@models/student';
import { useCMutation } from '@hooks/useCMutation';
import { FormFieldType, CForm } from '@components/form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@components/ui/form';
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
  batchQueryKey,
  domainQueryKey,
  projectsQueryKey
} from '@constants/query-keys';
import { addmissionColumn } from '@constants/columns/admission-column';
import { Checkbox } from '@components/ui/checkbox';
import { Heading } from '@components/ui/heading';
import { AxiosError } from 'axios';
import { Button } from '@components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';

const Model = z.object({
  project_id: z.string().uuid({
    message: 'Project is required'
  }),
  domain_id: z.string().uuid({
    message: 'Domain is required'
  }),
  status: z.string()
});

type Model = z.infer<typeof Model>;
const BatchModel = z.object({
  project_id: z.string().uuid({}).array(),
  domain_id: z.string().uuid({}).array(),
  batch_id: z.string().uuid({
    message: 'Batch is required'
  })
});

type BatchModel = z.infer<typeof BatchModel>;
const emptyOptions: OptionsT[] = [
  {
    label: 'N/A',
    value: ''
  }
];
const AdmitCandidate = () => {
  const { setId, id } = useAppliedStudentsStore();
  const [isSelectedProjectId, setIsSelectedProjectId] = useState('');
  const form = useForm<Model>({
    resolver: zodResolver(Model),
    defaultValues: {
      status: 'Selected'
    }
  });
  const watchProjectId = useWatch({
    control: form.control,
    name: 'project_id'
  });
  const watchDomainId = useWatch({
    control: form.control,
    name: 'domain_id'
  });

  const batchForm = useForm<BatchModel>({
    resolver: zodResolver(BatchModel)
  });

  const { mutateAsync, isLoading, data, reset } = useCMutation({
    method: 'POST',
    url: 'registration/get-student-for-batch',
    queryKey: appliedApplicantQueryKey
  });

  const projectQuery = useCQuery({
    url: 'project',
    queryKey: projectsQueryKey
  });

  const url: string = `registration/update-candidate-registration-status/${id}`;
  const mutate = useCMutation({
    url: url,
    method: 'PUT',
    queryKey: appliedApplicantQueryKey
  });
  const domainQuery = useCQuery({
    url: `project-domain/get-domain-by-project/${form.watch('project_id')}`,
    queryKey: [projectsQueryKey, domainQueryKey],
    enabled: !!watchProjectId
  });

  const batchQuery = useCQuery({
    url: `batch`,
    queryKey: batchQueryKey,
    enabled: !!watchProjectId && !!watchDomainId
  });
  const batchOptions: OptionsT[] = batchQuery.data?.data?.map((item: any) => ({
    label: item.batch_code,
    value: item.id
  }));
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

  const allotBatch = useCMutation({
    url: 'registration/add-student-to-batch',
    method: 'POST',
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
      readOnly: !!watchProjectId ? false : true,
      options: isDomainOptions ?? emptyOptions
    }
  ];
  async function updateStudentStatus(batch_id: string, id: string) {
    try {
      // Handle "Alloted" status
      batchForm.trigger();
      if (!batch_id) {
        showToast(
          FailedToastTitle,
          'Please select a batch to allot',
          'destructive'
        );
        return;
      }
      if (!id) {
        showToast(FailedToastTitle, 'Domian ID is required', 'destructive');
        return;
      }
      const res = await allotBatch.mutateAsync({
        status: 'Alloted',
        batch_id: batch_id,
        domain_applied_id: id
      });

      if (res.success) {
        setId('');
      }
      return;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        showToast(
          FailedToastTitle,
          error.response?.data?.message || 'An error occurred',
          'destructive'
        );
      } else {
        showToast(
          FailedToastTitle,
          error.message || 'An unknown error occurred',
          'destructive'
        );
      }
    } finally {
      mutateAsync({
        status: 'Selected',
        project_id: watchProjectId,
        domain_id: watchDomainId
      });
    }
  }
  const columns: ColumnDef<StudentRegistrationModelType>[] = [
    {
      id: 'select',
      header: () => <Checkbox disabled aria-label="Select all" />,
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.original.status === 'Alloted'}
            onClick={async () => {
              if (row.original.status === 'Selected' && row.original.id) {
                setId(row.original.id);
                if (id) {
                  await updateStudentStatus(
                    batchForm.getValues('batch_id'),
                    id
                  );
                }
              }
            }}
            onCheckedChange={async () => row.toggleSelected()}
          />
        );
      }
    },
    ...addmissionColumn
  ];

  const onSubmit = async (data: Model) => {
    try {
      await mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message, 'destructive');
      return;
    }
  };

  useEffect(() => {
    if (watchProjectId && watchProjectId !== isSelectedProjectId) {
      domainQuery.refetch();
      setIsSelectedProjectId(form.getValues('project_id'));
    }
  }, [form, domainQuery, watchProjectId, isSelectedProjectId]);
  console.log(form.formState.errors);
  return (
    <>
      <div className="flex-1 space-y-4 px-1">
        <div className="flex items-start justify-between">
          <Heading
            title={`Admit Selected Candidate`}
            description="Manage Selected Student"
          />
        </div>
        <Separator />
        <Form {...form}>
          <form
            className="grid grid-cols-12 items-start gap-x-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {formFields.map((input: FormFieldType, i) => (
              <div className="col-span-full md:col-span-4" key={i}>
                <FormField
                  control={form.control}
                  disabled={input.readOnly ?? false}
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
            <div className="col-span-full flex h-full items-center justify-start md:col-span-4 md:pt-5">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
               List 
              </Button>
            </div>
          </form>
        </Form>
        <Separator />
        <Form {...batchForm}>
          <CForm
            form={batchForm}
            fields={[
              {
                label: 'Allot to Batch',
                name: 'batch_id',
                select: true,
                options: batchOptions
              }
            ]}
            loading={isLoading}
            className="sm:col-span-4 md:col-span-4"
          />
        </Form>
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

export default AdmitCandidate;
