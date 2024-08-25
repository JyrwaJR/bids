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
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { Heading } from '@components/ui/heading';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { OptionsT } from '@components/form/type';
import { useAuthContext } from '@context/auth';
const studentsColumn: ColumnDef<any>[] = [
  {
    header: 'Name',
    accessorKey: 'first_name',
    cell: ({ row }) => (
      <>
        <p>
          {row.original.first_name} {row.original.last_name}
        </p>
      </>
    )
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
    accessorKey: 'first_name',
    cell: ({ row }) => (
      <>
        <p>
          {row.original.first_name} {row.original.last_name}
        </p>
      </>
    )
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
const options: OptionsT[] = [
  {
    label: 'Enrolled Students',
    value: 'enrolled'
  },
  {
    label: 'Applicants',
    value: 'applicant'
  }
];
const Model = z.object({
  name: z
    .string()
    .min(1, { message: 'Please enter name' }) // Ensures the name is not empty
    .refine((v) => v.trim().length > 0, {
      message: 'Name cannot contain only spaces'
    }),
  type: z.string().refine((v) => v.trim().length > 0, {
    message: 'Please select type'
  })
});

type Model = z.infer<typeof Model>;
export const SearchPage = () => {
  const search = useSearchParams().get('q');
  const { user } = useAuthContext();
  const defaultQuery = search ? search : 'students';
  const isSearchApplicants: boolean = defaultQuery === 'applicants';
  const form = useForm<Model>({
    resolver: zodResolver(Model),
    defaultValues: {
      name: '',
      type: 'applicants'
    }
  });
  const id = user?.role !== 'superadmin' ? user?.centre_id : null;
  const studentMutation = useMutation({
    mutationFn: async (data: Model) =>
      await searchStudentByName(data.type, data.name, id),
    mutationKey: [studentQueryKey, form.watch('name')]
  });
  const onSubmit: SubmitHandler<Model> = async (data) => {
    try {
      await studentMutation.mutateAsync(data);
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
            <FormField
              control={form.control}
              name={'type'}
              render={({ field }) => (
                <FormItem>
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
                      {options?.map((option: OptionsT, i: number) => (
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
          columns={
            form.getValues('type') !== 'enroll'
              ? applicantsColumn
              : studentsColumn
          }
          data={studentMutation.isSuccess && studentMutation.data.data}
          searchKey="name"
        />
      </div>
    </div>
  );
};
