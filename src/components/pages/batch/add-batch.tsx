import { Form } from '@components/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { batchFields } from '@constants/input-fields';
import { FailedToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { BatchModel, BatchModelType } from '@src/models';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Props = {
  open: boolean;
  onClose: () => void;
  domainId?: string;
};
export const AddBatch = ({ open, onClose, domainId }: Props) => {
  const form = useForm<BatchModelType>({
    resolver: zodResolver(BatchModel),
    defaultValues: {
      domain_id: domainId
    }
  });
  const { mutateAsync, isLoading } = useCMutation({
    url: 'batch',
    queryKey: ['get', 'batch'],
    method: 'POST'
  });
  const onSubmit: SubmitHandler<BatchModelType> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  console.log(form.formState.errors);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Batch</DialogTitle>
          <DialogDescription>
            please fill the following fields
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          fields={batchFields}
          loading={isLoading}
          btnStyle="md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};
