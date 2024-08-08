'use client';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Heading } from '@components/ui/heading';
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
} from './_lib/function';

import { zodResolver } from '@hookform/resolvers/zod';

import { MultiStepForm } from '@components/form';
import { useRegistrationFields } from './_lib/useRegistrationFields';
import { useRegisterStudentStore } from '@lib/store';
import { AlertModal } from '@components/modal/alert-modal';
import { format } from 'date-fns';
import { useMultiStepFormStore } from '@components/form/stepper-form';

const Registration = () => {
  const { currentStep, setCurrentStep } = useMultiStepFormStore();
  const { setId, id } = useRegisterStudentStore();
  const [isSameAsPresent, setIsSameAsPresent] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(!!id);
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
    },
    mode: 'all'
  });
  const { field } = useRegistrationFields({
    form: form
  });

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
          // Perform the second step operations
          const personalRes = await addPersonalDetails(id, data);

          if (!personalRes.success) {
            showToast(FailedToastTitle, 'Error when adding personal detail');
          }

          break;
        case 2:
          const domainAppliedRes = await studentAppliedDomain(id, data);
          if (!domainAppliedRes.success) {
            showToast(FailedToastTitle, 'Error when adding domain applied');
          }
          break;
        case 3:
          const familyRes = await addFamilyDetails(id, data);
          if (!familyRes.success) {
            showToast(FailedToastTitle, 'Error when adding family detail');
          }
          break;
        case 4:
          const addressRes = await addAddressDetails(id, data);
          if (!addressRes.success) {
            showToast(FailedToastTitle, 'Error when adding address detail');
          }
          break;
        case 5:
          break;
        case 6:
          if (data.is_bpl === 'Yes') {
            const bplRes = await addStudentBpl(id, data);
            if (!bplRes.success) {
              showToast(FailedToastTitle, 'Error when adding BPL detail');
            }
          }
          const otherDetailRes = await otherDetails(id, data);
          if (!otherDetailRes.success) {
            showToast(FailedToastTitle, 'Error when adding other detail');
          }
          showToast(SuccessToastTitle, 'Registration Successful');
          break;
        default:
          break;
      }
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
    }
  };

  return (
    <>
      <div className="flex items-center justify-start">
        <Heading
          title="Student Registration"
          description="Follow the steps to complete your profile"
        />
      </div>
      <MultiStepForm
        onClick={() => setIsSameAsPresent(!isSameAsPresent)}
        checked={isSameAsPresent}
        form={form}
        onSubmit={onSubmit}
        steps={field}
      />

      {id && (
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Registered"
          onConfirm={() => {
            setId('');
            setCurrentStep(0);
            setIsOpen(false);
          }}
          desc="You have already registered. If you want to update your registration, please click on update button"
          btnText="New Registration"
        />
      )}
    </>
  );
};

export default Registration;
