'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationPersonalRequestModelType } from '@models/registration/registration-personal-request-model';
import { StudentRegistrationModel } from '@src/models/student/student-registration-model';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StudentRegistrationModelType } from '../../../models/student/student-registration-model';
import { studentRegistrationStepsFields } from '@constants/input-fields/students/student-registration-fields';
import { StepperForm } from '@components/form';
import { Heading } from '@components/ui/heading';

const Registration = () => {
  const form = useForm<StudentRegistrationModelType>({
    resolver: zodResolver(StudentRegistrationModel),
    mode: 'all'
  });
  const onSubmit: SubmitHandler<RegistrationPersonalRequestModelType> = (
    data
  ) => {
    console.log(data);
  };
  console.log(form.formState.errors);
  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);
  return (
    <div className="h-full w-full px-5">
      <div className="flex items-center justify-between">
        <Heading
          title="Student Registration"
          description="Follow the steps to complete your profile"
        />
      </div>
      <StepperForm
        form={form}
        className="w-full sm:col-span-4 md:col-span-4 lg:col-span-3"
        onSubmit={onSubmit}
        steps={studentRegistrationStepsFields}
      />
    </div>
  );
};

export default Registration;
