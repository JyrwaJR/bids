import { DataTable } from '@components/ui/data-table'
import { searchStudentByName } from '@src/app/dashboard/registration/_lib/function'
import { ColumnDef } from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldsIsRequired } from '@constants/index'
import { z } from 'zod'
import { FormFieldType } from '@components/index'
import { studentQueryKey } from '@constants/query-keys'
import { FormControl, FormField, FormItem, Form } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { FailedToastTitle } from '@constants/toast-message'
import { showToast } from '@components/ui/show-toast'
import { useForm } from 'react-hook-form'
import Header from '@components/layout/header'
import { Heading } from '@components/ui/heading'
const FindStudentModel = z.object({
  name: z
    .string({
      required_error: FieldsIsRequired
    })
    .trim()
});
const searchStudentFields: FormFieldType[] = [
  {
    name: 'name'
  }
];

const studentsColumn: ColumnDef<any>[] = [
  {
    header: 'Name',
    accessorKey: 'first_name',
  },
  {
    header: 'Last Name',
    accessorKey: 'last_name',
  },
  {
    header: 'DOB',
    accessorKey: 'dob',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  }
]
const applicantsColumn: ColumnDef<any>[] = [
  {
    header: 'Name',
    accessorKey: 'first_name',
  },
  {
    header: 'Last Name',
    accessorKey: 'last_name',
  },
  {
    header: 'DOB',
    accessorKey: 'dob',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  }
]
export const SearchPage = () => {
  const search = useSearchParams().get('q')
  const defaultQuery = search ? search : 'students'
  const isSearchApplicants: boolean = defaultQuery === 'applicants'
  const url = isSearchApplicants ? 'registration/candidate-registration-list' : ''
  const form = useForm({
    defaultValues: {
      name: ''
    }
  })
  // check if search is not present then default to students    
  const studentMutation = useMutation({
    mutationFn: async () => await searchStudentByName(form.watch('name')),
    mutationKey: [studentQueryKey, form.watch('name')],
  })
  const applicantsMutation = useMutation({
    mutationFn: async () => await searchStudentByName(form.watch('name')),
    mutationKey: [studentQueryKey, form.watch('name')],
  })
  const onSubmit = async (data: any) => {
    try {
      if (defaultQuery === 'students') {
        await studentMutation.mutateAsync()
      } else {
        await applicantsMutation.mutateAsync()
      }
    } catch (error: any) {
      showToast(
        FailedToastTitle,
        error.message
      )
    }
  }
  return (
    <div className='px-1 space-y-10'>
      <div className='space-y-2'>
        <Heading
          title={`Search ${isSearchApplicants ? 'Applicants' : 'Students'}`}
          description={``}
        />
        <Form {...form}>
          <form className='flex space-x-2' onSubmit={form.handleSubmit(onSubmit)} >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className='flex w-[30%] space-x-2 items-center'>
                  <FormControl>
                    <Input placeholder="Please enter your full name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={form.getValues('name') === '' || form.getValues('name') === undefined || studentMutation.isLoading}
              type="submit">
              Search
            </Button>
          </form>
        </Form>
      </div>
      <div className='space-y-2'>
        <DataTable
          enableSearch={false}
          columns={isSearchApplicants ? applicantsColumn : studentsColumn}
          data={isSearchApplicants ? applicantsMutation.isSuccess && applicantsMutation.data.data : studentMutation.isSuccess && studentMutation.data.data}
          searchKey='name'
        />
      </div>
    </div>
  )
}
