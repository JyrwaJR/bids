'use client';
import { useState } from 'react';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import {
  StudentRegistrationModelWithDomain,
  StudentRegistrationModelWithDomainType,
  addAddressDetails,
  addFamilyDetails,
  addPersonalDetails,
  addStudentBpl,
  otherDetails
} from '@src/app/dashboard/registration/_lib/function';
import { zodResolver } from '@hookform/resolvers/zod';

import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { create } from 'zustand';
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
import { FormFieldType, Typography } from '@components/index';
import { CForm } from '@components/form';
import { handleBackendError } from '@constants/handle-backend-error';
import { useRegisterStudentStore } from '@lib/store';
import { Card } from '@components/ui/card';

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

type Props = {
  data?: StudentRegistrationModelWithDomainType;
  setData: () => void;
};
export const UpdateRegistrationStepperForm = ({ data, setData }: Props) => {
  const [isSameAsPresent, setIsSameAsPresent] = useState<boolean>(false);
  const { id, setId } = useRegisterStudentStore();
  const formStyle: string = 'w-full sm:col-span-6 md:col-span-6 xl:col-span-4';
  const datas = data && {
    ...data,
    ...data.form3B
  };
  const form = useForm<StudentRegistrationModelWithDomainType>({
    resolver: zodResolver(StudentRegistrationModelWithDomain),
    defaultValues: datas
  });

  useEffect(() => {
    if (data && data.id) {
      setId(data.id);
    }
  }, [data, setId]);

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
        (field: FormFieldType) => field.name as any
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

  useEffect(() => {
    if (data && data.id !== id) {
      setCurrentStep(0);
    }
  }, [data, id, setCurrentStep]);

  const onSubmit: SubmitHandler<
    StudentRegistrationModelWithDomainType
  > = async (data) => {
    try {
      switch (currentStep) {
        case 0:
          const personalRes = await addPersonalDetails(id, data);
          if (!personalRes.success) {
            showToast(FailedToastTitle, 'Error when adding personal detail');
            return false; // Return false if submission failed
          }
          break;
        case 1:
          const familyRes = await addFamilyDetails(id, data);
          if (!familyRes.success) {
            showToast(FailedToastTitle, 'Error when adding family detail');
            return false;
          }
          break;
        case 2:
          const addressRes = await addAddressDetails(id, data);
          if (!addressRes.success) {
            showToast(FailedToastTitle, 'Error when adding address detail');
            return false;
          }
          break;
        case 3:
          break;
        case 4:
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
        showToast('Validation Error', error.errors[0].message, 'destructive');
        return false;
      } else if (error instanceof AxiosError) {
        if (error.response?.data.status === 'error') {
          const errorResponse = error.response?.data.errors;
          const parsedErrors = handleBackendError(errorResponse);
          showToast(
            FailedToastTitle,
            parsedErrors?.message ?? 'An error occurred',
            'destructive'
          );
        }
        if (error.response?.data.success === false) {
          showToast(
            FailedToastTitle,
            error.response.data.message,
            'destructive'
          );
          return false;
        }
        return false;
      } else {
        showToast(
          'Error',
          error.message || 'An unexpected error occurred',
          'destructive'
        );
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

  useEffect(() => {
    // passport is not required and should be set to null if not provided
    if (id) {
      form.setValue('passport', undefined);
    }
  }, [id]);
  const watchDisabled = useWatch({
    control: form.control,
    name: 'is_disabled'
  });
  return (
    <section>
      <Stepper
        steps={steps
          .filter((stp) => stp.name !== 'Start Registration')
          .map((step) => ({
            label: step.name
          }))}
        className="hidden max-w-full overflow-auto md:flex"
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {currentStep < steps.length ? (
            steps.map((step, index) => (
              <div
                key={step.name + index}
                className={index === currentStep ? '' : 'hidden'}
              >
                {step.name === 'Upload Documents' ? (
                  <UploadImageModal
                    isDisabled={watchDisabled === 'No' ? true : false}
                    fields={step.fields}
                  />
                ) : (
                  <>
                    {step.name === 'Address' ? (
                      <div className="flex flex-col space-y-4">
                        <Card className="p-4">
                          <Typography size={'h4'} weight={'bold'}>
                            Present Address
                          </Typography>
                          <CForm
                            form={form}
                            className={formStyle}
                            loading={false}
                            disabled={false}
                            fields={step.fields.filter(
                              (field: FormFieldType) =>
                                !field.name.startsWith('p_')
                            )}
                          />
                        </Card>
                        <Separator />
                        <Card className="p-4">
                          <Typography size={'h4'} weight={'bold'}>
                            Parmanent Address
                          </Typography>
                          <div className="flex items-center space-x-2 py-4">
                            <Checkbox
                              checked={isSameAsPresent}
                              onClick={() =>
                                setIsSameAsPresent(!isSameAsPresent)
                              }
                              name="address"
                            />
                            <Label>Same as present Address</Label>
                          </div>
                          <CForm
                            form={form}
                            disabled={false}
                            loading={false}
                            className={formStyle}
                            fields={step.fields
                              .filter((field: FormFieldType) =>
                                field.name.startsWith('p_')
                              )
                              ?.map((field: FormFieldType) => ({
                                ...field,
                                readOnly: isSameAsPresent
                              }))}
                          />
                        </Card>
                      </div>
                    ) : step.name === 'Preview' ? (
                      <>
                        <PreviewForm
                          id={(data && data.id) ?? ''}
                          fields={steps}
                          form={form}
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
            <PreviewForm
              id={data?.id ? data.id : ''}
              fields={steps}
              form={form}
            />
          )}
          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={currentStep === 0 ? setData : prev}
              >
                <ArrowLeft className="mr-4" />
                {currentStep > 0 ? 'Back' : 'Back'}
              </Button>
              <Button
                type="submit"
                onClick={currentStep === steps.length - 1 ? setData : next}
              >
                {currentStep < steps.length ? (
                  <>
                    Next
                    <ArrowRight className="ml-4" />
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};
