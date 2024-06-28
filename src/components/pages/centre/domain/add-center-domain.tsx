import { FormFieldType } from '@components/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { useAuthContext } from '@context/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { CenterDomainModel, CenterDomainModelType } from '@src/models';

import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@src/components';
import { useCQuery } from '@hooks/useCQuery';
import { OptionsT } from '@components/form/type';

type Props = {
  open: boolean;
  onClose: () => void;
  domain_id: string[];
};
export const AddCentreDomain = ({ onClose, open, domain_id }: Props) => {
  const { user } = useAuthContext();
  const { mutateAsync, isLoading } = useCMutation({
    url: 'centre-domain/save',
    method: 'POST',
    queryKey: ['get', 'domain']
  });
  const {
    data,
    isLoading: loading,
    isFetched
  } = useCQuery({
    url: 'centre',
    queryKey: ['get', 'centre']
  });

  const form = useForm<CenterDomainModelType>({
    resolver: zodResolver(CenterDomainModel),
    defaultValues: {
      domain_id: domain_id
    }
  });
  const onSubmit = useCallback(
    async (data: CenterDomainModelType) => {
      try {
        if (data.domain_id.length > 0) {
          return await mutateAsync(data);
        }
        showToast(FailedToastTitle, 'Domain is required');
      } catch (error: any) {
        showToast(FailedToastTitle, error.message);
      }
    },
    [mutateAsync]
  );

  useEffect(() => {
    if (user?.role && user?.role !== 'superadmin') {
      onSubmit(form.getValues());
      onClose();
    }
  }, [user, form, onSubmit, onClose]);
  const centreOptions: OptionsT[] | undefined =
    isFetched &&
    !isLoading &&
    data.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }));

  const fields: FormFieldType[] = [
    {
      name: 'centre_id',
      label: 'Center',
      select: true,
      options: centreOptions,
      required: true
    }
  ];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Center Domain</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam totam
            magnam pariatur maxime, autem quibusdam!
          </DialogDescription>
        </DialogHeader>
        {isFetched && (
          <Form
            form={form}
            onSubmit={onSubmit}
            loading={isLoading || loading || !isFetched}
            fields={fields}
            btnStyle="md:w-full"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
