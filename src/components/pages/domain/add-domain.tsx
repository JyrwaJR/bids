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
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { useCQuery } from '@hooks/useCQuery';
import { OptionsT } from '@components/form/type';
import { domainQueryKey, sectorQueryKey } from '@constants/query-keys';
import { axiosInstance } from '@lib/utils';
import { AxiosError } from 'axios';
import { appendNonFileDataToFormData } from '@lib/appendNoneFileDataToFileData';

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
        const res = await axiosInstance.post('/domain/save', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.status === 200 && res.data.success) {
          showToast(SuccessToastTitle, res.data.message);
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
            Please enter the following details
          </DialogDescription>
        </DialogHeader>
        <Form
          fields={updateFields}
          form={form}
          loading={isLoading}
          onSubmit={onSubmit}
          className="md:col-span-6"
        />
      </DialogContent>
    </Dialog>
  );
};
