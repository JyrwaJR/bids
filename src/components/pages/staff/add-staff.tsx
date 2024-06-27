import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Form, FormFieldType } from '@components/form';
import { FailedToastTitle } from '@src/constants/toast-message';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCMutation, useCQuery } from '@src/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@src/components/ui/show-toast';
import { staffFields } from '@constants/input-fields/staff/staff-fields';
import { CenterModelType, StaffModel, StaffModelType } from '@src/models';
import { Typography } from '@components/typography';
type Props = {
  open: boolean;
  onClose: () => void;
};
export const AddStaff = ({ onClose, open }: Props) => {
  const form = useForm<StaffModelType>({
    resolver: zodResolver(StaffModel)
  });
  const { isLoading: cLoading, data: cData } = useCQuery({
    url: 'centre',
    queryKey: []
  });

  const { isLoading: scLoading, data: scData } = useCQuery({
    url: 'staffcategory',
    queryKey: []
  });
  const { isLoading, mutateAsync } = useCMutation({
    url: 'staff/save',
    method: 'POST',
    queryKey: ['add center ']
  });
  const onSubmitAddStaff: SubmitHandler<StaffModelType> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  const StaffCategoryOption =
    !scLoading &&
    scData.data.data.map((item: CenterModelType) => ({
      label: item.name,
      value: item.id
    }));

  const centerOptions =
    !cLoading &&
    cData.data.data.map((item: CenterModelType) => ({
      label: item.name,
      value: item.id
    }));
  const staffFormWithCenterId: FormFieldType[] = [
    {
      name: 'centre_id',
      label: 'Center',
      select: true,
      options: centerOptions
    },
    {
      name: 'staff_category_id',
      label: 'Staff Category',
      select: true,
      options: StaffCategoryOption
    },
    ...staffFields
  ];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[1200px]">
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
          <DialogDescription asChild>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
              reprehenderit sit quisquam
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <Form
          onSubmit={onSubmitAddStaff}
          fields={staffFormWithCenterId}
          form={form}
          loading={isLoading || cLoading || scLoading}
          className=" md:col-span-6 md:w-full lg:col-span-4"
        />
      </DialogContent>
    </Dialog>
  );
};
