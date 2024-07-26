import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Form, FormFieldType } from '@src/components';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { z } from 'zod';
import { useSectorStore } from '@lib/store';
import { sectorQueryKey } from '@constants/query-keys';

const sectorFields: FormFieldType[] = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Name',
    type: 'text',
    required: true
  }
];
const SectorModel = z.object({
  name: z.string().min(3, { message: 'Name is required' })
});
type SectorModelType = z.infer<typeof SectorModel>;
export const AddSector = () => {
  const { id, open, onOpenChange: onClose, setId } = useSectorStore();
  const form = useForm<SectorModelType>({
    resolver: zodResolver(SectorModel)
  });
  const url = !!id ? `sector/update/${id}` : 'sector/save';
  const { mutateAsync, isLoading } = useCMutation({
    url: url,
    method: !!id ? 'PUT' : 'POST',
    queryKey: sectorQueryKey
  });

  const onSubmit: SubmitHandler<SectorModelType> = async (data) => {
    try {
      const res = await mutateAsync(data);
      if (res.success) {
        form.reset();
        onClose(false);
        if (!!id) {
          setId('');
        }
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{!!id ? 'Update' : 'Add'} Sector</DialogTitle>
          <DialogDescription>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.{' '}
          </DialogDescription>
        </DialogHeader>
        <Form
          fields={sectorFields}
          form={form}
          loading={isLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
