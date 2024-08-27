import { useEffect } from 'react';
import { DataTable } from '@components/ui/data-table';
import { searchStudentByName } from '@src/app/dashboard/registration/_lib/function';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'react-query';
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
import { useForm, SubmitHandler } from 'react-hook-form';
import { Heading } from '@components/ui/heading';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

const options = [
  {
    label: 'Enrolled Students',
    value: 'enrolled'
  },
  {
    label: 'Applicants',
    value: 'applicants'
  }
];

const Model = z.object({
  name: z
    .string()
    .min(1, { message: 'Please enter name' })
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
  const defaultQuery = search || 'enrolled';
  const isSearchApplicants = defaultQuery === 'applicants';
  const form = useForm<Model>({
    resolver: zodResolver(Model),
    defaultValues: {
      name: '',
      type: isSearchApplicants ? 'applicants' : 'enrolled'
    }
  });

  const { reset, handleSubmit, control, getValues } = form;

  const id = user?.role !== 'superadmin' ? user?.centre_id : null;

  const studentMutation = useMutation({
    mutationFn: async (data: Model) =>
      await searchStudentByName(data.type, data.name, id)
  });

  const onSubmit: SubmitHandler<Model> = async (data) => {
    try {
      await studentMutation.mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  // Effect to reset form when search query changes
  useEffect(() => {
    const updatedType = search === 'applicants' ? 'applicants' : 'enrolled';
    reset({
      name: '',
      type: updatedType
    });
  }, [search, reset]);

  return (
    <div className="space-y-10 px-1">
      <div className="space-y-2">
        <Heading
          title={`Search ${isSearchApplicants ? 'Applicants' : 'Students'}`}
          description={`Search ${
            isSearchApplicants ? 'Applicants' : 'Students'
          } by name, title, mobile number, registration number`}
        />
        <Form {...form}>
          <form className="flex space-x-2" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
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
              disabled={getValues('name') === '' || studentMutation.isLoading}
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
            getValues('type') !== 'enrolled' ? applicantsColumn : studentsColumn
          }
          data={studentMutation.isSuccess && studentMutation.data.data}
          searchKey="name"
        />
      </div>
    </div>
  );
};
