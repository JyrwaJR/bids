import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Form, FormFieldType } from '@components/form';
import { Typography } from '@components/typography';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { staffFields } from '@constants/input-fields/staff/staff-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@src/components/ui/show-toast';
import {
  FailedToastTitle,
  SuccessToastTitle
} from '@src/constants/toast-message';
import { useCMutation, useCQuery } from '@src/hooks';
import { CenterModelType, StaffModel, StaffModelType } from '@src/models';
import { ScrollArea } from '@components/ui/scroll-area';
import { useAuthContext } from '@context/auth';
import {
  centreQueryKey,
  staffCategoryQueryKey,
  staffQueryKey
} from '@constants/query-keys';
import { OptionsT } from '@components/form/type';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const AddStaff = ({ onClose, open }: Props) => {
  const { user } = useAuthContext();
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
        onClose();
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen  w-full max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>
            <Typography
              size={'h2'}
              className="uppercase"
              weight={'bold'}
              colors="primary"
            >
              Add new Staff
            </Typography>
          </DialogTitle>
          <DialogDescription>
            Please enter the following details
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <Form
            onSubmit={onSubmitAddStaff}
            fields={staffFormWithCenterId}
            form={form}
            loading={isLoading || cLoading || scLoading}
            className="md:col-span-6 md:w-full lg:col-span-4"
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
