import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Form } from '@src/components';
import { domainFields } from '@constants/input-fields/domain';

import { zodResolver } from '@hookform/resolvers/zod';
import { DomainModel, DomainModelType } from '@src/models';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const AddDomain = ({ onClose, open }: Props) => {
  const form = useForm<DomainModelType>({
    resolver: zodResolver(DomainModel)
  });
  const { mutateAsync, isLoading } = useCMutation({
    url: 'domain/save',
    method: 'POST',
    queryKey: ['get', 'domain']
  });
  const onSubmit: SubmitHandler<DomainModelType> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Domain</DialogTitle>
          <DialogDescription>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.{' '}
          </DialogDescription>
        </DialogHeader>
        <Form
          fields={domainFields}
          form={form}
          loading={isLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
