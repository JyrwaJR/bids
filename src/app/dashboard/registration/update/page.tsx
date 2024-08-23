'use client';
import { FieldsIsRequired } from '@constants/index';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuthContext } from '@context/auth';
import { Typography } from '@components/index';

const FindStudentModel = z.object({
  name: z
    .string({
      required_error: FieldsIsRequired
    })
    .trim()
});
type FindStudentModelType = z.infer<typeof FindStudentModel>;

const Page = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isStudentList, setIsStudentList] = React.useState<
    StudentRegistrationModelWithDomainType[]
  >([]);
  const { user } = useAuthContext();
  const [isSelectedApplicant, setSelectedApplicant] =
    useState<StudentRegistrationModelWithDomainType>();
  const form = useForm({
    resolver: zodResolver(FindStudentModel),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit: SubmitHandler<FindStudentModelType> = async (data) => {
    try {
      setIsSearching(true);
      const centerId = user?.role === 'superadmin' ? null : user?.centre_id;
      const res = await searchStudentByName(
        'applicantes',
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
      id: 'select',
      header: 'Select',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <Button
            onClick={() => {
              setSelectedApplicant(
                data as StudentRegistrationModelWithDomainType
              );
            }}
            variant={'secondary'}
          >
            Update <PencilIcon className="ml-4 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false
    }
  ];
  return (
    <div>
      {isSelectedApplicant ? (
        <>
          <div className="flex justify-between">
            <Typography size={'h3'} colors={'primary'}>
              REGNO:{isSelectedApplicant.registration_no ?? ''}
            </Typography>
            <Button
              className="capitalize "
              onClick={() => setSelectedApplicant(undefined)}
            >
              <PersonIcon className="mr-2 h-4 w-4" />
              change
            </Button>
          </div>
          <UpdateRegistrationStepperForm data={isSelectedApplicant} />
        </>
      ) : (
        <>
          {isStudentList && (
            <div className="space-y-2 px-2">
              <div className="flex items-start justify-between">
                <Heading
                  title={`Search Student`}
                  description={`Search Students by name,title, mobile number, registration number`}
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
  );
};

export default Page;
