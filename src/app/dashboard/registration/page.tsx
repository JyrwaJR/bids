'use client';
import React from 'react';
import { Heading } from '@components/ui/heading';
import { RegistrationStepperForm } from '@components/form/registration-stepper-form';

const Registration = () => {
  return (
    <>
      <div className="flex items-center justify-start">
        <Heading
          title="Student Registration"
          description="Please enter the following information"
        />
      </div>
      <RegistrationStepperForm />
    </>
  );
};

export default Registration;
