import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Form, FormFieldType } from '@src/components';
import { domainFields } from '@constants/input-fields/domain';
import { zodResolver } from '@hookform/resolvers/zod';
import { DomainModel, DomainModelType } from '@src/models';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { useCQuery } from '@hooks/useCQuery';
import { OptionsT } from '@components/form/type';
import { domainQueryKey, sectorQueryKey } from '@constants/query-keys';

type Props = {
  open: true | false;
  onClose: () => void;
};

export const AddDomain = ({ onClose, open }: Props) => {
  const form = useForm<DomainModelType>({
    resolver: zodResolver(DomainModel)
  });
  const sectorQuery = useCQuery({
    url: 'sector',
    queryKey: sectorQueryKey
  });

  const sectorOptions: OptionsT[] =
    sectorQuery.isFetched &&
    !sectorQuery.isLoading &&
    sectorQuery.data.data.map((item: { name: string; id: string }) => {
      return { label: item.name, value: item.id.toString() };
    });
  const { mutateAsync, isLoading } = useCMutation({
    url: 'domain/save',
    method: 'POST',
    queryKey: domainQueryKey
  });

  const onSubmit: SubmitHandler<DomainModelType> = async (data) => {
    try {
      const res = await mutateAsync(data);
      if (res.success === true) {
        form.reset();
        onClose();
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  const updateFields: FormFieldType[] = [
    ...domainFields,
    {
      name: 'sector_id',
      label: 'Sector',
      select: true,
      options:
        sectorQuery.isFetched && !sectorQuery.isLoading ? sectorOptions : []
    }
  ];
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
          fields={updateFields}
          form={form}
          loading={isLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
