import { Button } from '@components/ui/button';

import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { domainColumn } from '@constants/columns';
import { AddDomain } from '@components/pages';
import { ColumnDef } from '@tanstack/react-table';
import { StudentRegistrationModelType } from '@models/student';
import { CellAction } from '@components/tables/employee-tables/cell-action';
import { Dialog, DialogContent } from '@components/ui/dialog';
import { useCMutation } from '@hooks/useCMutation';
import { Form, FormFieldType } from '@components/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OptionsT } from '@components/form/type';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { FailedToastTitle } from '@constants/toast-message';
import { showToast } from '@components/ui/show-toast';

const statusOptons: OptionsT[] = [
  {
    label: 'Pending',
    value: 'Waiting'
  },
  {
    label: 'Approved',
    value: 'Selected'
  },
  {
    label: 'Rejected',
    value: 'Rejected'
  }
];

const schema = z.object({
  project_id: z.string().uuid(),
  domain_id: z.string().uuid(),
  status: z.string()
});

type ModelType = z.infer<typeof schema>;

const AppliedStudentPage = () => {
  const { options, isLoading: OptLoading } = useCategorySelectOptions();
  const form = useForm<ModelType>({
    resolver: zodResolver(schema)
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, mutateAsync, isLoading } = useCMutation({
    method: 'POST',
    url: 'registration/candidate-registration-list',
    queryKey: ['get', 'applied-student']
  });
  // console.log(data);
  const formFields: FormFieldType[] = [
    {
      name: 'project_id',
      label: 'Project Name',
      select: true,
      options: options.projects
    },

    {
      name: 'domain_id',
      label: 'Domain Name',
      select: true,
      options: options.domain
    },
    {
      name: 'status',
      label: 'Status',
      select: true,
      options: statusOptons
    }
  ];
  const columns: ColumnDef<StudentRegistrationModelType | any>[] = [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
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
  const onSubmit = async (data: any) => {
    try {
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
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
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
          loading={isLoading || OptLoading}
          onSubmit={onSubmit}
          className="sm:col-span-4 md:col-span-4"
          btnText="Search"
        />
        <Separator />
        <DataTable searchKey="name" columns={columns} data={[]} />
      </div>
      <Dialog>
        <DialogContent></DialogContent>
      </Dialog>
    </>
  );
};

export default AppliedStudentPage;
