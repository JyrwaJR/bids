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
const Registration = () => {
  const formStyle = 'w-full sm:col-span-4 md:col-span-4 lg:col-span-3';

  const form = useForm<StudentRegistrationModelType>({
    resolver: zodResolver(StudentRegistrationModel),
    mode: 'onChange'
  });
  const onSubmit: SubmitHandler<RegistrationPersonalRequestModelType> = (
    data
  ) => {
    // console.log(data);
  };

  const formComponents: ReactElement[] = [
    <StudentPersonalDetailsForm
      key="personal-details"
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
    <StudentOtherInfoForm key="other-info" className={formStyle} form={form} />,
    <StudentParentDetailsForm
      key="parents-details"
      className={formStyle}
      form={form}
    />
  ];
  return (
    <div className="px-5 py-10">
      <div className="flex items-center justify-start">
        <Heading
          title="Student Registration"
          description="Follow the steps to complete your profile"
        />
      </div>
      <StepperForm form={form} onSubmit={onSubmit} steps={formComponents} />
    </div>
  );
};

export default Registration;
