'use client';
import { useEffect, useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Button } from '@src/components/ui/button';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';

import { FormFieldType } from '@components/form/type';
import { CForm } from '@components/form/form';
import { Typography } from '@components/typography';
import { Form } from '@components/ui/form';
import { StepsFieldFormT } from '@src/types';

interface StepperProps<T> {
  steps: StepsFieldFormT[];
  loading?: boolean;
  form: UseFormReturn<T | any>;
  onSubmit: SubmitHandler<T | any>;
  className?: string;
}

const Stepper = <T,>({
  steps,
  form,
  onSubmit,
  loading = false
}: StepperProps<T>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setTrigger] = useState<number>(0); // State to trigger re-render

  const next = async () => {
    const fields = steps[currentStep].fields.map((field) => field.name);
    const isValid = await form.trigger(fields as (keyof FormFieldType)[]);
    if (isValid) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  useEffect(() => {
    setTrigger((trigger) => trigger + 1);
  }, [currentStep]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Profile Creation"
          description="Follow the steps to complete your profile"
        />
      </div>
      <Separator className="my-4" />
      <div>
        <Typography className="text-sm font-medium text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </Typography>
        <Typography>{steps[currentStep].name}</Typography>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <CForm
              form={form}
              fields={steps[currentStep].fields}
              loading={loading}
              className="col-span-12 md:col-span-4 lg:col-span-3"
            />
          </div>
          <div className="pt-5 mt-8">
            <div className="flex justify-between">
              <Button type="button" onClick={prev} disabled={currentStep === 0}>
                Previous
              </Button>
              <Button
                disabled={loading || currentStep === steps.length - 1}
                type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                onClick={
                  currentStep === steps.length - 1
                    ? form.handleSubmit(onSubmit)
                    : next
                }
              >
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Stepper;
