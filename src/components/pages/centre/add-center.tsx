import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@src/components/ui/show-toast';
import { addCenterFields } from '@src/constants/input-fields';
import {
  FailedToastTitle,
  SuccessToastTitle
} from '@src/constants/toast-message';
import { useCMutation, useCategorySelectOptions } from '@src/hooks';
import { CenterModel, CenterModelType } from '@src/models';

import { Form } from '../../form';
import { FormFieldType } from '@components/form/type';
import { centreQueryKey } from '@constants/query-keys';
import { Separator } from '@components/ui/separator';
import { Heading } from '@components/ui/heading';
import { useRouter } from 'next/navigation';

export const AddCentre = () => {
  const { options, isLoading: isStateLoading } = useCategorySelectOptions();
  const router = useRouter();
  const form = useForm<CenterModelType>({
    resolver: zodResolver(CenterModel)
  });
  const { isLoading, mutateAsync } = useCMutation({
    url: 'centre/save',
    method: 'POST',
    queryKey: centreQueryKey
  });

  const onSubmitAddCentre: SubmitHandler<CenterModelType> = async (data) => {
    try {
      const res = await mutateAsync(data);
      if (res.success) {
        showToast(SuccessToastTitle, res.message);
        router.push('/dashboard/centre');
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  const fields: FormFieldType[] = [
    ...addCenterFields,
    {
      name: 'state_id',
      label: 'State',
      required: true,
      select: true,
      options: options.states
    },
    {
      name: 'district_id',
      label: 'District',
      required: true
    }
  ];
  return (
    <div className="flex-1 space-y-4">
      <Heading
        title={`Add New Center`}
        description="Please fill the following fields"
      />
      <Separator />
      <Form
        onSubmit={onSubmitAddCentre}
        fields={fields}
        form={form}
        loading={isLoading || isStateLoading}
        className="w-full md:col-span-6 md:w-full"
      />
    </div>
  );
};
