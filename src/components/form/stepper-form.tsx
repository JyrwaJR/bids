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
import { ScrollArea } from '@components/ui/scroll-area';

interface StepperProps<T> {
  steps: StepsFieldFormT[];
  loading?: boolean;
  form: UseFormReturn<T | any>;
  onSubmit: SubmitHandler<T | any>;
  className?: string;
}

export const StepperForm = <T,>({
  steps,
  form,
  onSubmit,
  loading = false,
  className
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
    <ScrollArea>
      <div className="max-h-full">
        <Separator />
        <div>
          <Typography size={'h3'} className="font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </Typography>
          <Typography size={'h2'}>{steps[currentStep].name}</Typography>
        </div>
        <Separator />
        <div className="h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-h-screen"
            >
              <CForm
                form={form}
                fields={steps[currentStep].fields}
                loading={loading}
                className={className}
              />
              <div className="flex justify-end space-x-5">
                <Button
                  type="button"
                  onClick={prev}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  disabled={loading}
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
            </form>
          </Form>
        </div>
      </div>
    </ScrollArea>
  );
};
