import { DataTable } from '@components/ui/data-table';
import { searchStudentByName } from '@src/app/dashboard/registration/_lib/function';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useMutation } from 'react-query';
import { studentQueryKey } from '@constants/query-keys';
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormMessage
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { FailedToastTitle } from '@constants/toast-message';
import { showToast } from '@components/ui/show-toast';
import { useForm } from 'react-hook-form';
import { Heading } from '@components/ui/heading';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
const studentsColumn: ColumnDef<any>[] = [
  {
    header: 'Name',
    accessorKey: 'first_name'
  },
  {
    header: 'Last Name',
    accessorKey: 'last_name'
  },
  {
    header: 'DOB',
    accessorKey: 'dob'
  },
  {
    header: 'Email',
    accessorKey: 'email'
  }
];
const applicantsColumn: ColumnDef<any>[] = [
  {
    header: 'Name',
    accessorKey: 'first_name'
  },
  {
    header: 'Last Name',
    accessorKey: 'last_name'
  },
  {
    header: 'DOB',
    accessorKey: 'dob'
  },
  {
    header: 'Email',
    accessorKey: 'email'
  }
];

const Model = z.object({
  name: z
    .string()
    .min(1, { message: 'Please enter name' }) // Ensures the name is not empty
    .refine((v) => v.trim().length > 0, {
      message: 'Name cannot contain only spaces'
    })
});

type Model = z.infer<typeof Model>;
export const SearchPage = () => {
  const search = useSearchParams().get('q');
  const defaultQuery = search ? search : 'students';
  const isSearchApplicants: boolean = defaultQuery === 'applicants';
  const form = useForm<Model>({
    resolver: zodResolver(Model),
    defaultValues: {
      name: ''
    }
  });
  // check if search is not present then default to students
  const studentMutation = useMutation({
    mutationFn: async () => await searchStudentByName(form.watch('name')),
    mutationKey: [studentQueryKey, form.watch('name')]
  });
  const applicantsMutation = useMutation({
    mutationFn: async () => await searchStudentByName(form.watch('name')),
    mutationKey: [studentQueryKey, form.watch('name')]
  });
  const onSubmit = async () => {
    try {
      if (defaultQuery === 'students') {
        await studentMutation.mutateAsync();
      } else {
        await applicantsMutation.mutateAsync();
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  return (
    <div className="space-y-10 px-1">
      <div className="space-y-2">
        <Heading
          title={`Search ${isSearchApplicants ? 'Applicants' : 'Students'}`}
          description={`Search ${
            isSearchApplicants ? 'Applicants' : 'Students'
          } by name,title, mobile number, registration number`}
        />
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
                studentMutation.isLoading
              }
              type="submit"
            >
              Search
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-2">
        <DataTable
          enableSearch={false}
          columns={isSearchApplicants ? applicantsColumn : studentsColumn}
          data={
            isSearchApplicants
              ? applicantsMutation.isSuccess && applicantsMutation.data.data
              : studentMutation.isSuccess && studentMutation.data.data
          }
          searchKey="name"
        />
      </div>
    </div>
  );
};
