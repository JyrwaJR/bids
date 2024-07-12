'use client';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Heading } from '@components/ui/heading';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { z, ZodError } from 'zod';
import { AxiosError } from 'axios';
import { useMutation, useQuery } from 'react-query';
import {
  getStudentDataIfExist,
  startRegistration,
  StudentRegistrationModelWithDomain,
  StudentRegistrationModelWithDomainType
} from './_lib/function';

import { zodResolver } from '@hookform/resolvers/zod';

import { MultiStepForm } from '@components/form';
import { useRegistrationFields } from './_lib/useRegistrationFields';
import { useRegisterStudentStore } from '@lib/store';
import { AlertModal } from '@components/modal/alert-modal';
import { useRouter } from 'next/navigation';

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
      registration_date: new Date().toISOString().split('T')[0],
      education: '10 pass'
    }
  });
  const { field } = useRegistrationFields({
    form: form
  });

  const studentQuery = useQuery({
    queryFn: async () => await getStudentDataIfExist(form.watch('first_name')),
    enabled: !!form.watch('first_name'),
    queryKey: form.watch('first_name')
  });

  const startRegisMutate = useMutation({
    mutationFn: async (data: StudentRegistrationModelWithDomainType) =>
      await startRegistration(data)
  });

  const onSubmit: SubmitHandler<
    StudentRegistrationModelWithDomainType
  > = async (data) => {
    try {
      StudentRegistrationModelWithDomain.parse(data);
      const response = await startRegisMutate.mutateAsync(data);
      setId(response.id);
      if (response.data.success && response.id === id) {
        showToast(SuccessToastTitle, 'Registration successful');
        router.push('/dashboard/registration/update');
      }
      return;
    } catch (error: any) {
      if (error instanceof z.ZodError || error instanceof ZodError) {
        showToast(FailedToastTitle, error.errors[0].message);
        return;
      } else if (error instanceof AxiosError) {
        showToast(FailedToastTitle, error.response?.data.message);
        return;
      } else {
        showToast(FailedToastTitle, error.message);
        return;
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
          loading={startRegisMutate.isLoading}
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
