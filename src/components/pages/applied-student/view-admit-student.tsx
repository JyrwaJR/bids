import { Separator } from '@components/ui/separator';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { StudentRegistrationModelType } from '@models/student';
import { useCMutation } from '@hooks/useCMutation';
import { FormFieldType } from '@components/form';
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
  domainQueryKey,
  projectsQueryKey
} from '@constants/query-keys';
import { addmissionColumn } from '@constants/columns/admission-column';
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
import { useRegistrationFields } from '@src/app/dashboard/registration/_lib/useRegistrationFields';

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

const emptyOptions: OptionsT[] = [
  {
    label: 'N/A',
    value: ''
  }
];
const ViewAdmitStudent = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [isSelectedProjectId, setIsSelectedProjectId] = useState('');
  const [isSelectedApplicant, setSelectedApplicant] =
    useState<StudentRegistrationModelType>();
  const previewForm = useForm<StudentRegistrationModelType>();
  // const { field: steps } = useRegistrationFields({ form: previewForm });
  const form = useForm<Model>({
    resolver: zodResolver(Model),
    defaultValues: {
      status: 'Alloted'
    }
  });
  const watchProjectId = useWatch({
    control: form.control,
    name: 'project_id'
  });

  const { mutateAsync, isLoading, data } = useCMutation({
    method: 'POST',
    url: 'registration/get-student-for-batch',
    queryKey: appliedApplicantQueryKey
  });

  const projectQuery = useCQuery({
    url: 'project',
    queryKey: projectsQueryKey
  });

  const domainQuery = useCQuery({
    url: `project-domain/get-domain-by-project/${form.watch('project_id')}`,
    queryKey: [projectsQueryKey, domainQueryKey],
    enabled: !!watchProjectId
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
  const columns: ColumnDef<StudentRegistrationModelType>[] = [
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
  return (
    <>
      {isPreview ? (
        <div className="space-y-2">
          <div className="flex w-full justify-end">
            <Button onClick={() => setIsPreview(false)}>Close</Button>
          </div>
          {/* <PreviewForm */}
          {/*   fields={steps} */}
          {/*   id={isSelectedApplicant?.id ?? ''} */}
          {/*   form={previewForm} */}
          {/* /> */}
        </div>
      ) : (
        <div className="flex-1 space-y-4 px-1">
          <div className="flex items-start justify-between">
            <Heading
              title={`View Admit Student`}
              description="Manage Admit Student"
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
                            {input.options?.map(
                              (option: OptionsT, i: number) => (
                                <SelectItem value={option.value} key={i}>
                                  {option.label}
                                </SelectItem>
                              )
                            )}
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
          <DataTable
            searchKey="first_name"
            columns={columns}
            data={data?.data ? data.data : []}
          />
        </div>
      )}
    </>
  );
};

export default ViewAdmitStudent;
