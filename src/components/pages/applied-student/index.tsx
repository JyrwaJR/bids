import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { StudentRegistrationModelType } from '@models/student';
import { useCMutation } from '@hooks/useCMutation';
import { Form, FormFieldType } from '@components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OptionsT } from '@components/form/type';
import { FailedToastTitle } from '@constants/toast-message';
import { showToast } from '@components/ui/show-toast';
import { useCQuery } from '@hooks/useCQuery';
import { SelectCheckbox } from '@components/select-checkbox';
import { z } from 'zod';
import { UpdateAppliedStudentForm } from './update-applied-students';

const StudentStatusOptions: OptionsT[] = [
  {
    label: 'Selected',
    value: 'Applied'
  },
  {
    label: 'Pending',
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
const AppliedStudentPage = () => {
  const [isSelectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectedProjectId, setIsSelectedProjectId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<ModelType>({
    resolver: zodResolver(AppliedStudentModel),
    defaultValues: {
      status: 'Applied'
    }
  });

  const { mutateAsync, isLoading, data } = useCMutation({
    method: 'POST',
    url: 'registration/candidate-registration-list',
    queryKey: ['get', 'applied-student']
  });
  console.log(data);

  const projectQuery = useCQuery({
    url: 'project',
    queryKey: ['get', 'project']
  });

  const domainQuery = useCQuery({
    url: `project-domain/get-domain-by-project/${form.watch('project_id')}`,
    queryKey: ['get', 'project', 'domain'],
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
  const columns: ColumnDef<StudentRegistrationModelType | any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <SelectCheckbox
          table={table}
          selectedIds={isSelectedIds}
          setSelectedIds={setSelectedIds}
          isHeader
        />
      ),
      cell: ({ row }) => (
        <SelectCheckbox
          row={row}
          selectedIds={isSelectedIds}
          setSelectedIds={setSelectedIds}
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'application_date',
      header: 'Application Date'
    },
    {
      accessorKey: 'status',
      header: 'Status'
    },
    {
      accessorKey: 'Action',
      header: 'Action'
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
            description="Manage ur Student table"
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
      {isOpen && (
        <UpdateAppliedStudentForm
          registration_id={isSelectedIds}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AppliedStudentPage;
