// 'use client';
import React from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Button } from '@src/components/ui/button';

import { Form } from '@components/ui/form';
import { ScrollArea } from '@components/ui/scroll-area';
import { useMultiStepForm } from '@hooks/useMultiStepForm';
import { Heading } from '@components/ui/heading';

interface StepperProps<T> {
  loading?: boolean;
  form: UseFormReturn<T | any>;
  onSubmit: SubmitHandler<T | any>;
  className?: string;
  steps: React.ReactElement[];
} 
export const StepperForm = <T,>({
  form,
  onSubmit,
  loading = false,
  steps: stepElements
}: StepperProps<T>) => {
  const {
    back: prev,
    next,
    step,
    steps,
    isFirstStep,
    isLastStep,
    currentStepIndex: currentStep
  } = useMultiStepForm({
    steps: stepElements,
    onTrigger: async () => await form.trigger()
  });

  return (
    <ScrollArea>
      <div className="max-h-full ">
        <div className="flex items-center justify-end">
          <Heading
            title={currentStep + 1 + ' of ' + steps.length}
            description=""
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-screen">
            {step}
            <div className="flex justify-end space-x-5">
              <Button type="button" onClick={prev} disabled={isFirstStep}>
                Previous
              </Button>
              <Button
                disabled={loading}
                type={isLastStep ? 'submit' : 'button'}
                onClick={isLastStep ? form.handleSubmit(onSubmit) : next}
              >
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};
