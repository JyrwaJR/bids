'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationPersonalRequestModelType } from '@models/registration/registration-personal-request-model';
import { StudentRegistrationModel } from '@src/models/student/student-registration-model';
import React, { ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StudentRegistrationModelType } from '../../../models/student/student-registration-model';
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
const Registration = () => {
  const formStyle: string = 'w-full sm:col-span-6 md:col-span-6 xl:col-span-4';

  const form = useForm<StudentRegistrationModelType>({
    resolver: zodResolver(StudentRegistrationModel)
  });
  const onSubmit: SubmitHandler<RegistrationPersonalRequestModelType> = (
    data
  ) => {
    console.log(data);
  };

  const formComponents: ReactElement[] = [
    <StudentPersonalDetailsForm
      className={formStyle}
      key="personal-details"
      form={form}
    />,
    <StudentParentDetailsForm
      key="parents-details"
      className={formStyle}
      form={form}
    />,
    <StudentPresentAddressForm
      key="present-address"
      className={formStyle}
      form={form}
    />,
    <StudentPermanentAddressForm
      key="permanent-address"
      className={formStyle}
      form={form}
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
