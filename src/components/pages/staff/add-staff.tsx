import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Form, FormFieldType } from '@components/form';
import { staffFields } from '@constants/input-fields/staff/staff-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@src/components/ui/show-toast';
import {
  FailedToastTitle,
  SuccessToastTitle
} from '@src/constants/toast-message';
import { useCMutation, useCQuery } from '@src/hooks';
import { CenterModelType, StaffModel, StaffModelType } from '@src/models';
import { useAuthContext } from '@context/auth';
import {
  centreQueryKey,
  staffCategoryQueryKey,
  staffQueryKey
} from '@constants/query-keys';
import { OptionsT } from '@components/form/type';
import { Heading } from '@components/ui/heading';
import { useRouter } from 'next/navigation';

export const AddStaff = () => {
  const { user } = useAuthContext();
  const router=useRouter()
  const form = useForm<StaffModelType>({
    resolver: zodResolver(StaffModel),
    defaultValues: {
      create_username: 'No',
      centre_id: user?.role === 'superadmin' ? '' : user?.centre_id
    }
  });

  const {
    isLoading: cLoading,
    data: cData,
    isFetched: isCFetch
  } = useCQuery({
    url: 'centre',
    queryKey: centreQueryKey
  });

  const {
    isLoading: scLoading,
    data: scData,
    isFetched
  } = useCQuery({
    url: 'staffcategory',
    queryKey: staffCategoryQueryKey
  });

  const { isLoading, mutateAsync } = useCMutation({
    url: 'staff/save',
    method: 'POST',
    queryKey: staffQueryKey
  });

  const onSubmitAddStaff: SubmitHandler<StaffModelType> = async (data) => {
    try {
      const res = await mutateAsync(data);
      if (res.success) {
        showToast(SuccessToastTitle, res.message);
        router.push('/dashboard/staff')
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  const StaffCategoryOption: OptionsT[] =
    isFetched && !scLoading && scData.data && user?.role === 'superadmin'
      ? scData.data.data.map((item: { name: string; id: string }) => ({
          label: item.name,
          value: item.id
        }))
      : isFetched &&
        scData.data.data
          .filter((item: { position: string }) => item.position !== 'hq')
          .map((item: { name: string; id: string }) => ({
            label: item.name,
            value: item.id
          }));

  const centerOptions =
    !cLoading &&
    isCFetch &&
    cData.data.map((item: CenterModelType) => ({
      label: item.name,
      value: item.id
    }));

  const staffFormWithCenterId: FormFieldType[] = [
    ...(user?.role === 'superadmin'
      ? [
          {
            name: 'centre_id',
            label: 'Center',
            select: true,
            options: centerOptions,
            required: true
          }
        ]
      : []),
    {
      name: 'staff_category_id',
      label: 'Staff Category',
      select: true,
      required: true,
      options: StaffCategoryOption
    },
    ...staffFields,
    ...(form.getValues('create_username') === 'Yes'
      ? [
          {
            name: 'password',
            label: 'Password',
            type: 'password'
          }
        ]
      : [])
  ];

  return (
    <div className="flex w-full flex-col space-y-4">
      <Heading title={`Add New Staff`} description="Please enter details" />
      <Form
        onSubmit={onSubmitAddStaff}
        fields={staffFormWithCenterId}
        form={form}
        loading={isLoading || cLoading || scLoading}
        className="md:col-span-6 md:w-full lg:col-span-4"
      />
    </div>
  );
};
