'use client';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Heading } from '@components/ui/heading';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { z, ZodError } from 'zod';
import { AxiosError } from 'axios';
import { useMutation, useQuery } from 'react-query';
import {
  addAddressDetails,
  addFamilyDetails,
  addPersonalDetails,
  addStudentBpl,
  otherDetails,
  studentAppliedDomain,
  StudentRegistrationModelWithDomain,
  StudentRegistrationModelWithDomainType
} from './_lib/function';

import { zodResolver } from '@hookform/resolvers/zod';

import { MultiStepForm } from '@components/form';
import { useRegistrationFields } from './_lib/useRegistrationFields';
import { useRegisterStudentStore } from '@lib/store';
import { AlertModal } from '@components/modal/alert-modal';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@lib/utils';
import { startRegisDetailType } from './_lib/type';

const Registration = () => {
  const router = useRouter();
  const { setId, id } = useRegisterStudentStore();
  const [isSameAsPresent, setIsSameAsPresent] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(!!id);
  const form = useForm<StudentRegistrationModelWithDomainType>({
    resolver: zodResolver(StudentRegistrationModelWithDomain),
    defaultValues: {
      marital_status: 'Single',
      religion: 'Christian',
      category: 'ST',
      education: '10 pass',
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
      // Validate the data using zod
      StudentRegistrationModelWithDomain.parse(data);

      // Prepare the payload for start registration
      const payload: startRegisDetailType = {
        dob: data.dob,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name
      };

      // Start registration only if ID does not exist
      if (!id) {
        const startRegisRes = await axiosInstance.post(
          '/registration/start-registration',
          payload
        );
        if (!startRegisRes.data.success) {
          throw new Error('Failed to start registration');
        }

        const idx = startRegisRes.data.data.id;
        setId(idx); // Update the ID state with the received ID
      }

      // Perform subsequent operations with the existing or newly set ID
      const personalRes = await addPersonalDetails(id, data);
      if (!personalRes.data.success) {
        showToast(FailedToastTitle, 'Error when adding personal detail');
      }

      console.log('Personal Detail:', personalRes.data.success);

      if (form.watch('project_id') === '') return;
      const domainAppliedRes = await studentAppliedDomain(id, data);
      if (!domainAppliedRes.data.success) {
        showToast(FailedToastTitle, 'Error when adding domain applied');
      }
      console.log('Applied Domain:', domainAppliedRes.data.success);

      const addressRes = await addAddressDetails(id, data);
      if (!addressRes.data.success) {
        // throw new Error('Error when adding address detail');
        showToast(FailedToastTitle, 'Error when adding address detail');
      }
      console.log('Address Detail:', addressRes.data.success);

      const familyRes = await addFamilyDetails(id, data);
      if (!familyRes.data.success) {
        // throw new Error('Error when adding family detail');
        showToast(FailedToastTitle, 'Error when adding family detail');
      }
      console.log('Family Detail:', familyRes.data.success);

      if (data.is_bpl === 'Yes') {
        const bplRes = await addStudentBpl(id, data);
        if (!bplRes.data.success) {
          showToast(FailedToastTitle, 'Error when adding BPL detail');
        }
        console.log('BPL Detail:', bplRes.data.success);
      }

      const otherDetailRes = await otherDetails(id, data);
      if (!otherDetailRes.data.success) {
        showToast(FailedToastTitle, 'Error when adding other detail');
      }
      console.log('Other Detail:', otherDetailRes.data.success);

      // Return success result with ID and data
      showToast('Success', 'Registration successful');
      router.push(`/dashboard/registration/update`);
    } catch (error: any) {
      // Enhanced error handling
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
      return;
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
          onConfirm={() => router.replace('/dashboard/registration/update')}
          desc="You have already registered. If you want to update your registration, please click on update button"
          btnText="Update"
        />
      )}
    </>
  );
};

export default Registration;
