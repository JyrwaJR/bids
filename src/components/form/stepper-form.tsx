'use client';

import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FormFieldType } from './type';
import { create } from 'zustand';
import { CForm } from './form';
import { Form } from '@components/ui/form';
import { Button } from '@components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Stepper } from 'react-form-stepper';
export type StepType = {
  id: string;
  name: string;
  fields: FormFieldType[];
};

type MultiStepType = {
  currentStep: number;
  previousStep: number;
  setPreviousStep: (step: number) => void;
  setCurrentStep: (step: number) => void;
};
export const useMultiStep = create<MultiStepType>((set) => ({
  currentStep: 0,
  previousStep: 0,
  setPreviousStep: (step) => set({ previousStep: step }),
  setCurrentStep: (step) => set({ currentStep: step })
}));
export default function MultiStepForm({
  form,
  onSubmit,
  steps
}: {
  onSubmit: SubmitHandler<any>;
  form: UseFormReturn<any>;
  steps: StepType[];
}) {
  const formStyle: string = 'w-full sm:col-span-6 md:col-span-6 xl:col-span-4';
  const { currentStep, setCurrentStep, setPreviousStep } = useMultiStep();
  const { trigger } = form;
  const fieldNames = steps[currentStep].fields.map((field) => field.name);
  const next = async () => {
    const output = await trigger(fieldNames, {
      shouldFocus: true
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      const step = currentStep + 1;
      setCurrentStep(step);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      const step = currentStep - 1;
      setCurrentStep(step);
    }
  };

  return (
    <section className="">
      {/* Form */}
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Stepper
            steps={steps.map((step) => ({
              label: step.name
            }))}
            styleConfig={{
              activeBgColor: '#333333',
              activeTextColor: '#FFFFFF',
              completedBgColor: '#000000',
              completedTextColor: '#FFFFFF',
              inactiveBgColor: '#B0B0B0',
              inactiveTextColor: '#FFFFFF',
              labelFontSize: '1rem',
              fontWeight: 'bold',
              size: '2em',
              borderRadius: '50%',
              circleFontSize: ''
            }}
            activeStep={currentStep}
          />
          {steps.map((step, index) => (
            <div
              key={step.name + index}
              className={index === currentStep ? '' : 'hidden'}
            >
              <CForm
                form={form}
                className={formStyle}
                loading={false}
                fields={step.fields}
              />
            </div>
          ))}

          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <Button type="button" onClick={prev} disabled={currentStep === 0}>
                <ArrowLeft className="mr-4" />
                Back
              </Button>
              {currentStep < steps.length - 1 && (
                <Button type="button" onClick={next}>
                  Next
                  <ArrowRight className="ml-4" />
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
