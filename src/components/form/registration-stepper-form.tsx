'use client';
import { useState } from 'react';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import {
  addAddressDetails,
  addFamilyDetails,
  addPersonalDetails,
  addStudentBpl,
  otherDetails,
  startRegistration,
  studentAppliedDomain,
  StudentRegistrationModelWithDomain,
  StudentRegistrationModelWithDomainType
} from '@src/app/dashboard/registration/_lib/function';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';

import { SubmitHandler, useForm } from 'react-hook-form';
import { FormFieldType } from './type';
import { create } from 'zustand';
import { CForm } from './form';
import { Form } from '@components/ui/form';
import { Button } from '@components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Stepper } from 'react-form-stepper';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import { useEffect } from 'react';
import UploadImageModal from '@components/upload-image-modal';
import { PreviewRegistrationForm as PreviewForm } from '@components/pages/registration/preview-registration-form';
import { useRegistrationFields } from '@src/app/dashboard/registration/_lib/useRegistrationFields';

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

const useMultiStepFormStore = create<MultiStepType>((set) => ({
  currentStep: 0,
  previousStep: 0,
  setPreviousStep: (step) => set({ previousStep: step }),
  setCurrentStep: (step) => set({ currentStep: step })
}));

export const RegistrationStepperForm = () => {
  const [isSameAsPresent, setIsSameAsPresent] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const formStyle: string = 'w-full sm:col-span-6 md:col-span-6 xl:col-span-4';
  const today = format(new Date(), 'yyyy-MM-dd');
  const form = useForm<StudentRegistrationModelWithDomainType>({
    resolver: zodResolver(StudentRegistrationModelWithDomain),
    defaultValues: {
      marital_status: 'Single',
      religion: 'Christian',
      category: 'ST',
      education: '10 pass',
      registration_date: today,
      is_bpl: 'No',
      is_disabled: 'No',
      is_minority: 'No'
    }
  });
  const { field: steps } = useRegistrationFields({
    form: form
  });
  const { currentStep, setCurrentStep, setPreviousStep } =
    useMultiStepFormStore();
  const { trigger } = form;
  // check here for the error argument type string[] is not assignable to parameter type ('id'|| so on)

  const next = async () => {
    const data = form.getValues();

    // Ensure fieldNames is properly typed as an array of valid form field names
    const fieldNames =
      steps[currentStep]?.fields.map(
        (field) => field.name as keyof StudentRegistrationModelWithDomainType
      ) ?? [];

    // Validate the fields of the current step
    const isValid = await trigger(fieldNames, {
      shouldFocus: true
    });

    // If the validation fails, do not proceed
    if (!isValid) return;

    // Submit the data
    const submitSuccess = await onSubmit(data);

    // Move to the next step only if submit was successful
    if (submitSuccess) {
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

  const onSubmit: SubmitHandler<
    StudentRegistrationModelWithDomainType
  > = async (data) => {
    try {
      switch (currentStep) {
        case 0:
          if (!id) {
            const startRegisRes = await startRegistration(data);
            if (!startRegisRes.data.success) {
              throw new Error('Failed to start registration');
            }
            const idx = startRegisRes.data.data.id;
            setId(idx); // Update the ID state with the received ID
          }
          break;
        case 1:
          const personalRes = await addPersonalDetails(id, data);
          if (!personalRes.success) {
            showToast(FailedToastTitle, 'Error when adding personal detail');
            return false; // Return false if submission failed
          }
          break;
        case 2:
          const domainAppliedRes = await studentAppliedDomain(id, data);
          if (!domainAppliedRes.success) {
            showToast(FailedToastTitle, 'Error when adding domain applied');
            return false;
          }
          break;
        case 3:
          const familyRes = await addFamilyDetails(id, data);
          if (!familyRes.success) {
            showToast(FailedToastTitle, 'Error when adding family detail');
            return false;
          }
          break;
        case 4:
          const addressRes = await addAddressDetails(id, data);
          if (!addressRes.success) {
            showToast(FailedToastTitle, 'Error when adding address detail');
            return false;
          }
          break;
        case 5:
          break;
        case 6:
          if (data.is_bpl === 'Yes') {
            const bplRes = await addStudentBpl(id, data);
            if (!bplRes.success) {
              showToast(FailedToastTitle, 'Error when adding BPL detail');
              return false;
            }
          }
          const otherDetailRes = await otherDetails(id, data);
          if (!otherDetailRes.success) {
            showToast(FailedToastTitle, 'Error when adding other detail');
            return false;
          }
          showToast(SuccessToastTitle, 'Registration Successful');
          break;
        default:
          break;
      }

      return true; // Return true if submission was successful
    } catch (error: any) {
      if (error instanceof ZodError) {
        showToast('Validation Error', error.errors[0].message);
      } else if (error instanceof AxiosError) {
        showToast(
          'Request Error',
          error.response?.data.message || 'An error occurred'
        );
      } else {
        showToast('Error', error.message || 'An unexpected error occurred');
      }

      return false; // Return false if any error was caught
    }
  };

  useEffect(() => {
    if (isSameAsPresent) {
      form.reset({
        ...form.getValues(),
        p_address: form.getValues('present_address'),
        p_landmark: form.getValues('landmark'),
        p_village: form.getValues('village'),
        p_panchayat: form.getValues('panchayat'),
        p_block: form.getValues('block'),
        p_police_station: form.getValues('police_station'),
        p_post_office: form.getValues('post_office'),
        p_district: form.getValues('district'),
        p_state: form.getValues('state'),
        p_pin_code: form.getValues('pin_code')
      });
    }
  }, [isSameAsPresent, form]);
  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stepper
            steps={steps.map((step) => ({
              label: step.name
            }))}
            className="max-w-full overflow-auto"
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

          {currentStep < steps.length ? (
            steps.map((step, index) => (
              <div
                key={step.name + index}
                className={index === currentStep ? '' : 'hidden'}
              >
                {step.name === 'Upload Documents' ? (
                  <UploadImageModal fields={step.fields} />
                ) : (
                  <>
                    {step.name === 'Address' ? (
                      <>
                        <CForm
                          form={form}
                          className={formStyle}
                          loading={false}
                          disabled={false}
                          fields={step.fields.filter(
                            (field) => !field.name.startsWith('p_')
                          )}
                        />
                        <Separator />
                        <div className="flex items-center space-x-2 py-4">
                          <Checkbox
                            checked={isSameAsPresent}
                            onClick={() => setIsSameAsPresent(!isSameAsPresent)}
                            name="address"
                          />
                          <Label>Same as present</Label>
                        </div>
                        <CForm
                          form={form}
                          disabled={false}
                          loading={false}
                          className={formStyle}
                          fields={step.fields
                            .filter((field) => field.name.startsWith('p_'))
                            ?.map((field) => ({
                              ...field,
                              readOnly: isSameAsPresent
                            }))}
                        />
                      </>
                    ) : (
                      <CForm
                        form={form}
                        className={formStyle}
                        disabled={false}
                        loading={false}
                        fields={step.fields}
                      />
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <PreviewForm fields={steps} form={form} />
          )}

          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <Button type="button" onClick={prev} disabled={currentStep === 0}>
                <ArrowLeft className="mr-4" />
                Back
              </Button>
              <Button
                // disabled={disabled || loading}
                type="button"
                onClick={next}
              >
                {currentStep < steps.length ? (
                  <>
                    Next
                    <ArrowRight className="ml-4" />
                  </>
                ) : (
                  'Preview'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};
