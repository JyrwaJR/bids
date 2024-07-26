'use client';
import { FormFieldType } from '@components/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Label } from '@components/ui/label';
import { FieldsIsRequired } from '@constants/index';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ZodError, z } from 'zod';
import { useRegistrationFields } from '../_lib/useRegistrationFields';
import {
  StudentRegistrationModelWithDomain,
  StudentRegistrationModelWithDomainType,
  addFamilyDetails,
  addPersonalDetails,
  searchStudentByName, addStudentBpl, otherDetails, addAddressDetails, studentAppliedDomain
} from '../_lib/function';
import { MultiStepForm } from '@components/form';
import { useRegisterStudentStore } from '@lib/store/useStudentRegistration';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { DataTable } from '@components/ui/data-table';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { ColumnDef } from '@tanstack/react-table';
import {
  StudentRegistrationModel,
  StudentRegistrationModelType
} from '@models/student';
import { PencilIcon } from 'lucide-react';
import { Button } from '@components/ui/button';
import { AxiosError } from 'axios';
import { useMultiStepFormStore } from '@components/form/stepper-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { SelectItem, SelectTrigger, Select, SelectContent, SelectValue } from '@components/ui/select';
import { Input } from '@components/ui/input';

const FindStudentModel = z.object({
  name: z
    .string({
      required_error: FieldsIsRequired
    })
    .trim()
});
type FindStudentModelType = z.infer<typeof FindStudentModel>;
const Page = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [isStudentList, setIsStudentList] = React.useState<
    StudentRegistrationModelWithDomainType[]
  >([]);
  const [isSelectedApplicant, setSelectedApplicant] = useState<any>();
  const form = useForm({
    resolver: zodResolver(FindStudentModel),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit: SubmitHandler<FindStudentModelType> = async (data) => {
    try {
      setIsSearching(true);
      const res = await searchStudentByName(data.name.toLowerCase());
      if (res.success) setIsStudentList(res.data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    } finally {
      setIsSearching(false);
    }
  };
  const studentColumn: ColumnDef<StudentRegistrationModelType>[] = [
    {
      accessorKey: 'first_name'
    },
    {
      accessorKey: 'last_name'
    },
    {
      accessorKey: 'dob'
    },
    {
      accessorKey: 'email'
    },
    {
      accessorKey: 'mobile'
    },
    {
      accessorKey: 'Update',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <Button
            onClick={() => {
              setSelectedApplicant(data);
            }}
            variant={'secondary'}
          >
            Update <PencilIcon className="ml-4 h-4 w-4" />
          </Button>
        );
      }
    }
  ];
  const searchStudentFields: FormFieldType[] = [
    {
      name: 'name'
    }
  ];
  return (
    <div>
      {isSelectedApplicant ? (
        <UpdateForm data={isSelectedApplicant} />
      ) : (
        <>
          {isStudentList && (
            <div className="space-y-2 px-2">
              <div className="flex items-start justify-between">
                <Heading
                  title={`Search Student`}
                  description={`Results by the name ${form.watch('name')}`}
                />
              </div>
              <Form {...form}>
                <form className='flex space-x-2' onSubmit={form.handleSubmit(onSubmit)} >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className='flex space-x-2 items-center'>
                        <FormControl>
                          <Input placeholder="Please enter your full name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={form.getValues('name') === '' || form.getValues('name') === undefined || isSearching}
                    type="submit">
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
      )
      }
    </div >
  );
};

export default Page;
type Props = {
  data: StudentRegistrationModelWithDomainType;
};
const UpdateForm = ({ data }: Props) => {
  const { currentStep } = useMultiStepFormStore();
  const { setId, id } = useRegisterStudentStore();
  const updateForm = useForm<StudentRegistrationModelWithDomainType>({
    resolver: zodResolver(StudentRegistrationModelWithDomain),
    defaultValues: data
  });
  useEffect(() => {
    if (data.id) {
      setId(data.id);
    }
  }, [data]);
  const { field } = useRegistrationFields({
    form: updateForm
  });
  const onSubmit: SubmitHandler<StudentRegistrationModelWithDomainType> = async (data) => {
    try {
      switch (currentStep) {
        case 0:
          break;
        case 1:
          // Perform the second step operations
          const personalRes = await addPersonalDetails(id, data);

          if (!personalRes.success) {
            showToast(FailedToastTitle, 'Error when adding personal detail');
          }

          break;
        case 2:
          const domainAppliedRes = await studentAppliedDomain(id, data);
          if (!domainAppliedRes.success) {
            showToast(FailedToastTitle, 'Error when adding domain applied');
          }
          break;
        case 3:
          const familyRes = await addFamilyDetails(id, data);
          if (!familyRes.success) {
            showToast(FailedToastTitle, 'Error when adding family detail');
          }
          break;
        case 4:
          const addressRes = await addAddressDetails(id, data);
          if (!addressRes.success) {
            showToast(FailedToastTitle, 'Error when adding address detail');
          }
          break;
        case 5:
          break;
        case 6:
          if (data.is_bpl === 'Yes') {
            const bplRes = await addStudentBpl(id, data);
            if (!bplRes.success) {
              showToast(FailedToastTitle, 'Error when adding BPL detail');
            }
          }
          const otherDetailRes = await otherDetails(id, data);
          if (!otherDetailRes.success) {
            showToast(FailedToastTitle, 'Error when adding other detail');
          }
          showToast(SuccessToastTitle, 'Registration Successful');
          break;
        default:
          break;
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        showToast('Validation Error', error.errors[0].message);
      } else if (error instanceof AxiosError) {
        showToast(
          'Request Error',
          error.response?.data.message || 'An error occurred'
        );
      } else {
        showToast('Error', error.message || 'An unexpected error occurred');
      }
    }
  }
  return <MultiStepForm form={updateForm} onSubmit={onSubmit} steps={field} />;
};
