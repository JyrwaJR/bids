'use client';
import React from 'react';
import { Heading } from '@components/ui/heading';
import { RegistrationStepperForm } from '@components/form/registration-stepper-form';
import { Card } from '@components/ui/card';

const Registration = () => {
  return (
    <div className="flex h-screen w-full items-start justify-start">
      <Card className="w-full p-10">
        <Heading
          title="Student Registration"
          description="Please enter the following information"
        />
        <RegistrationStepperForm />
      </Card>
    </div>
  );
};

export default Registration;
