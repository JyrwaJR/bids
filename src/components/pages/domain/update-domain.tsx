import React, { useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Form, FormFieldType } from '@src/components';
import { domainFormFields as domainFields } from '@constants/input-fields/domain/domain-form-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import { DomainModel, DomainModelType } from '@src/models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { AxiosError } from 'axios';
import { appendNonFileDataToFormData } from '@lib/appendNoneFileDataToFileData';
import { domainQueryKey } from '@constants/query-keys';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';

type Props = {
  open: true | false;
  onClose: () => void;
  data: DomainModelType | any;
  id: string;
};

export const UpdateDomain = ({ onClose, id, data, open }: Props) => {
  const { options } = useCategorySelectOptions();
  const form = useForm<DomainModelType>({
    resolver: zodResolver(DomainModel),
    defaultValues: data
  });
  useEffect(() => {
    if (!(data.curriculum instanceof File)) {
      form.setValue('curriculum', undefined);
    }

    if (!(data.guide instanceof File)) {
      form.setValue('guide', undefined);
    }
  }, [data, form]);

  const { mutateAsync, isLoading } = useCMutation({
    url: `domain/update/${id}`,
    method: 'PUT',
    queryKey: domainQueryKey
  });

  const onSubmit: SubmitHandler<DomainModelType> = async (data) => {
    try {
      if (!id || id === '') return;
      if (!data.guide && !data.curriculum) {
        const res = await mutateAsync(data);
        if (res.success) {
          showToast(SuccessToastTitle, res.message);
          onClose();
        }
      } else if (data.curriculum && data.guide) {
        const formData = new FormData();
        formData.append('guide', data.guide);
        formData.append('curriculum', data.curriculum);
        // Append other data to formData
        appendNonFileDataToFormData<DomainModelType>(data, formData);
        const res = await mutateAsync(formData);
        if (res.success) {
          showToast(SuccessToastTitle, res.message);
          onClose();
        }
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        showToast(FailedToastTitle, error.response?.data.message);
      } else {
        showToast(FailedToastTitle, error.message);
      }
    }
  };
  const updatedFields: FormFieldType[] = [
    ...domainFields,
    {
      name: 'sector',
      label: 'Sector',
      select: true,
      options: options.sectors.map((item) => ({
        label: item.label,
        value: item.label
      }))
    }
  ];
  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Domain</DialogTitle>
          <DialogDescription>
            Please enter the following details
          </DialogDescription>
        </DialogHeader>
        <Form
          fields={updatedFields}
          form={form}
          loading={isLoading}
          onSubmit={onSubmit}
          btnStyle="md:w-full"
          className="md:col-span-6"
        />
      </DialogContent>
    </Dialog>
  );
};
