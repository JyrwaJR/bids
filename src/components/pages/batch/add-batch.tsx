import { Form, FormFieldType } from '@src/components';
import { domainFormFields as domainFields } from '@constants/input-fields/domain/domain-form-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BatchModel,
  BatchModelType,
  DomainModel,
  DomainModelType
} from '@src/models';
import React from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { AxiosError } from 'axios';
import { appendNonFileDataToFormData } from '@lib/appendNoneFileDataToFileData';
import {
  batchQueryKey,
  domainQueryKey,
  projectsQueryKey,
  staffQueryKey
} from '@constants/query-keys';
import { Separator } from '@components/ui/separator';
import { Heading } from '@components/ui/heading';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { batchFields } from '@constants/input-fields';
import { useCQuery } from '@hooks/useCQuery';
import { OptionsT } from '@components/form/type';

export const AddBatch = () => {
  const form = useForm<BatchModelType>({
    resolver: zodResolver(BatchModel)
  });
  const { options } = useCategorySelectOptions();
  const { mutateAsync, isLoading } = useCMutation({
    url: 'batch/save',
    method: 'POST',
    queryKey: batchQueryKey
  });
  const watchProjectId = useWatch({
    control: form.control,
    name: 'project_id'
  });
  const staffQuery = useCQuery({
    url: `staff`,
    queryKey: staffQueryKey
  });
  const domainQuery = useCQuery({
    url: `project-domain/get-domain-by-project/${form.watch('project_id')}`,
    queryKey: [projectsQueryKey, domainQueryKey],
    enabled: !!watchProjectId
  });

  const isDomainOptions: OptionsT[] = domainQuery.data?.data?.map(
    (item: any) => ({
      label: item.domain,
      value: item.domain_id
    })
  );
  const staffOptions: OptionsT[] = staffQuery.data?.data?.data?.map(
    (item: any) => ({
      label: item.name,
      value: item.id
    })
  );

  const onSubmit: SubmitHandler<DomainModelType> = async (data) => {
    try {
      if (!data.guide && !data.curriculum) {
        const res = await mutateAsync(data);
        if (res.success) {
          showToast(SuccessToastTitle, res.message);
          form.reset();
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
    {
      name: 'project_id',
      label: 'Select Project',
      select: true,
      options: options.projects
    },
    {
      name: 'domain_id',
      label: 'Domain',
      select: true,
      readOnly: !!watchProjectId ? false : true,
      options: isDomainOptions
    },
    ...batchFields,
    {
      name: 'trainer_id',
      label: 'Trainer',
      select: true,
      options: staffOptions,
      required: true
    },
    {
      name: 'support_trainer_id',
      options: staffOptions,
      label: 'Support Trainer',
      select: true
    }
  ];
  return (
    <div className="flex-1 space-y-4">
      <Heading title={`Add Batch`} description="Please enter the  following" />
      <Separator />
      <Form
        fields={updatedFields}
        form={form}
        loading={isLoading}
        onSubmit={onSubmit}
        className="sm:col-span-6 md:col-span-4"
      />
    </div>
  );
};
