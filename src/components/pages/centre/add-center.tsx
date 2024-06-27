import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@src/components/ui/show-toast';
import { addCenterFields } from '@src/constants/input-fields';
import { FailedToastTitle } from '@src/constants/toast-message';
import { useCMutation } from '@src/hooks';
import { CenterModel, CenterModelType } from '@src/models';

import { Form } from '../../form';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '../../ui/dialog';

type Props = {
  open: boolean;
  onClose: () => void;
};
export const AddCentre = ({ onClose, open }: Props) => {
  const form = useForm<CenterModelType>({
    resolver: zodResolver(CenterModel)
  });
  const { isLoading, mutateAsync } = useCMutation({
    url: 'centre/save',
    method: 'POST',
    queryKey: ['add center ']
  });
  const onSubmitAddCentre: SubmitHandler<CenterModelType> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>Lorem ipsum dolor sit amet</DialogTitle>
          <DialogDescription asChild>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            reprehenderit sit quisquam
          </DialogDescription>
        </DialogHeader>
        <Form
          onSubmit={onSubmitAddCentre}
          fields={addCenterFields}
          form={form}
          loading={isLoading}
          btnStyle="md:w-full"
          className="w-full md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};
