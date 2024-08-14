import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@src/components/ui/show-toast';
import { addCenterFields } from '@src/constants/input-fields';
import {
  FailedToastTitle,
  SuccessToastTitle
} from '@src/constants/toast-message';
import { useCMutation, useCategorySelectOptions } from '@src/hooks';
import { CenterModel, CenterModelType } from '@src/models';

import { Form } from '../../form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../ui/dialog';
import { FormFieldType } from '@components/form/type';
import { centreQueryKey } from '@constants/query-keys';

type Props = {
  open: boolean;
  onClose: () => void;
};
export const AddCentre = ({ onClose, open }: Props) => {
  const { options, isLoading: isStateLoading } = useCategorySelectOptions();
  const form = useForm<CenterModelType>({
    resolver: zodResolver(CenterModel)
  });
  const { isLoading, mutateAsync } = useCMutation({
    url: 'centre/save',
    method: 'POST',
    queryKey: centreQueryKey
  });

  const onSubmitAddCentre: SubmitHandler<CenterModelType> = async (data) => {
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

  const fields: FormFieldType[] = [
    ...addCenterFields,
    {
      name: 'state_id',
      label: 'State',
      required: true,
      select: true,
      options: options.states
    },
    {
      name: 'district_id',
      label: 'District',
      required: true
    }
  ];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Center</DialogTitle>
          <DialogDescription>
            Please enter the following details
          </DialogDescription>
        </DialogHeader>
        <Form
          onSubmit={onSubmitAddCentre}
          fields={fields}
          form={form}
          loading={isLoading || isStateLoading}
          className="w-full md:col-span-6 md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};
