'use client';
import { FieldsIsRequired } from '@constants/index';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BanIcon, EyeIcon, Plus } from 'lucide-react';
import { PreviewRegistrationForm as PreviewForm } from '@components/pages/registration/preview-registration-form';
import { z } from 'zod';
import {
  StudentRegistrationModelWithDomainType,
  searchStudentByName
} from '../_lib/function';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { DataTable } from '@components/ui/data-table';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { ColumnDef } from '@tanstack/react-table';
import { PencilIcon } from 'lucide-react';
import { Button } from '@components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { UpdateRegistrationStepperForm } from '@components/pages/registration/update-registration';
import { searchRegistrationStudentColumn } from '@constants/columns/search/registration-students-column';
import { useAuthContext } from '@context/auth';
import { Typography } from '@components/index';
import { useRouter } from 'next/navigation';
import { PreviewRegistrationForm } from '@components/pages/registration/preview-registration-form';
import { useRegistrationFields } from '../_lib/useRegistrationFields';
const FindStudentModel = z.object({
  name: z
    .string({
      required_error: FieldsIsRequired
    })
    .trim()
});
type FindStudentModelType = z.infer<typeof FindStudentModel>;

const Page = () => {
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isStudentList, setIsStudentList] = React.useState<
    StudentRegistrationModelWithDomainType[]
  >([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user } = useAuthContext();
  const [isSelectedApplicant, setSelectedApplicant] =
    useState<StudentRegistrationModelWithDomainType>();

  const previewForm = useForm({
    defaultValues: isSelectedApplicant
  });
  const { field: steps } = useRegistrationFields({
    form: previewForm
  });
  const form = useForm({
    resolver: zodResolver(FindStudentModel),
    defaultValues: {
      name: ''
    }
  });
  useEffect(() => {
    if (isPreview) {
      previewForm.reset(isSelectedApplicant);
    }
  }, [isPreview, isSelectedApplicant, previewForm]);
  const onSubmit: SubmitHandler<FindStudentModelType> = async (data) => {
    try {
      setIsSearching(true);
      const centerId = user?.role === 'superadmin' ? null : user?.centre_id;
      const res = await searchStudentByName(
        'applicant',
        data.name.toLowerCase(),
        centerId
      );
      if (res.success) setIsStudentList(res.data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const studentColumn: ColumnDef<StudentRegistrationModelWithDomainType>[] = [
    ...searchRegistrationStudentColumn,
    {
      id: 'view',
      header: 'View',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <Button
            onClick={() => {
              if (row.original) {
                setSelectedApplicant(data);
                setIsPreview(true);
              }
            }}
            variant={'outline'}
            size={'icon'}
          >
            <EyeIcon />
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'select',
      header: 'Update',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <Button
            onClick={() => {
              setSelectedApplicant(
                data as StudentRegistrationModelWithDomainType
              );
              setIsEditing(true);
            }}
            size={'icon'}
          >
            <PencilIcon />
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false
    }
  ];
  return (
    <div>
      {isPreview ? (
        <div className="space-y-2">
          <div className="flex w-full justify-end">
            <Button onClick={() => setIsPreview(false)}>Close</Button>
          </div>
          <PreviewForm
            fields={steps}
            id={isSelectedApplicant?.id ?? ''}
            form={previewForm}
          />
        </div>
      ) : (
        <div>
          {isEditing ? (
            <>
              <Typography size={'h3'} colors={'primary'}>
                REGNO:
                {(isSelectedApplicant && isSelectedApplicant.registration_no) ??
                  ''}
              </Typography>
              <UpdateRegistrationStepperForm
                setData={() => {
                  setSelectedApplicant(undefined);
                  setIsEditing(false);
                }}
                data={isEditing && isSelectedApplicant}
              />
            </>
          ) : (
            <>
              {isStudentList && (
                <div className="space-y-2 px-2">
                  <div className="flex items-start justify-between">
                    <Heading
                      title={`Search Applicants`}
                      description={`Search Applicants by name,title, mobile number, registration number`}
                    />
                  </div>
                  <Form {...form}>
                    <form
                      className="flex space-x-2"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="flex w-[40%] flex-col items-start justify-center space-x-2">
                            <FormControl>
                              <Input placeholder="Search..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        disabled={
                          form.getValues('name') === '' ||
                          form.getValues('name') === undefined ||
                          isSearching
                        }
                        type="submit"
                      >
                        Search
                      </Button>
                    </form>
                  </Form>
                  <Separator />
                  <DataTable
                    enableSearch={false}
                    searchKey="first_name"
                    columns={studentColumn}
                    data={isStudentList}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
