'use client';
import React, { ReactElement } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  StudentRegistrationModel,
  StudentRegistrationModelType
} from '@models/student';
import { StepperForm } from '@components/form';
import { Heading } from '@components/ui/heading';
import {
  StudentOtherInfoForm,
  StudentPermanentAddressForm,
  StudentPersonalDetailsForm,
  StudentPresentAddressForm,
  StudentParentDetailsForm
} from '@components/pages';
import { ScrollArea } from '@components/ui/scroll-area';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
const Registration = () => {
  const formStyle: string = 'w-full sm:col-span-6 md:col-span-6 xl:col-span-4';

  const form = useForm<StudentRegistrationModelType>({
    resolver: zodResolver(StudentRegistrationModel)
  });
  const { mutateAsync, isLoading } = useCMutation({
    url: '',
    queryKey: ['add registration'],
    method: 'POST'
  });
  const onSubmit: SubmitHandler<StudentRegistrationModelType> = async (
    data
  ) => {
    try {
      await mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  const formComponents: ReactElement[] = [
    <StudentPersonalDetailsForm
      className={formStyle}
      key="personal-details"
      form={form}
      loading={isLoading}
    />,
    <StudentParentDetailsForm
      key="parents-details"
      className={formStyle}
      form={form}
      loading={isLoading}
    />,
    <StudentPresentAddressForm
      key="present-address"
      className={formStyle}
      form={form}
      loading={isLoading}
    />,
    <StudentPermanentAddressForm
      key="permanent-address"
      className={formStyle}
      form={form}
      loading={isLoading}
    />,
    <StudentOtherInfoForm key="other-info" className={formStyle} form={form} />
  ];
  return (
    <ScrollArea>
      <div className="px-5 py-10">
        <div className="flex items-center justify-start">
          <Heading
            title="Student Registration"
            description="Follow the steps to complete your profile"
          />
        </div>
        <StepperForm form={form} onSubmit={onSubmit} steps={formComponents} />
      </div>
    </ScrollArea>
  );
};

export default Registration;
