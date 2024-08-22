import { Form } from '@src/components';
import { domainFormFields as domainFields } from '@constants/input-fields/domain/domain-form-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import { DomainModel, DomainModelType } from '@src/models';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { AxiosError } from 'axios';
import { appendNonFileDataToFormData } from '@lib/appendNoneFileDataToFileData';
import { domainQueryKey } from '@constants/query-keys';
import { useRouter } from 'next/navigation';
import { Separator } from '@components/ui/separator';
import { Heading } from '@components/ui/heading';

export const AddDomain = () => {
  const router = useRouter();
  const form = useForm<DomainModelType>({
    resolver: zodResolver(DomainModel)
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
          router.push('/dashboard/domain');
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
          router.push('/dashboard/domain');
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
  return (
    <div className="flex-1 space-y-4">
      <Heading title={`Domain`} description="Manage Domain table" />
      <Separator />
      <Form
        fields={domainFields}
        form={form}
        loading={isLoading}
        onSubmit={onSubmit}
        className="sm:col-span-6 md:col-span-4"
      />
    </div>
  );
};
