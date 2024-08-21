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
import { useAppliedStudentsStore } from '@lib/store';
import {
  appliedApplicantQueryKey,
  domainQueryKey,
  projectsQueryKey
} from '@constants/query-keys';
import { addmissionColumn } from '@constants/columns/admission-column';
import { Checkbox } from '@components/ui/checkbox';
import { Heading } from '@components/ui/heading';

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
const AdmitCandidate = () => {
  const { setId, id } = useAppliedStudentsStore();
  const [isSelectedProjectId, setIsSelectedProjectId] = useState('');
  const form = useForm<ModelType>({
    resolver: zodResolver(AppliedStudentModel),
    defaultValues: {
      status: 'Applied'
    }
  });

  const { mutateAsync, isLoading, data } = useCMutation({
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
      readOnly: form.getValues('project_id') ? false : true,
      options: isDomainOptions ?? emptyOptions
    }
  ];
  async function updateStudentStatus() {
    try {
      // /registration/add-student-to-batch
      await allotBatch.mutateAsync({
        status: 'Alloted',
        project_id: form.getValues('project_id'),
        domain_id: form.getValues('domain_id')
      });
    } catch (error: any) {
      showToast(FailedToastTitle, error.error);
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
            onCheckedChange={async () => {
              if (row.original.status === 'Selected' && row.original.id) {
                setId(row.original.id);
                if (id) {
                  await updateStudentStatus();
                }
              }
            }}
          />
        );
      }
    },
    ...addmissionColumn
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
            title={`Admit Candidate`}
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

export default AdmitCandidate;
