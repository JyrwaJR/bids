'use client';
import React, { ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StudentRegistrationModel } from '@models/student';
import { StepperForm } from '@components/form';
import { Heading } from '@components/ui/heading';
import {
  StudentOtherInfoForm,
  StudentPermanentAddressForm,
  StudentPersonalDetailsForm,
  StudentPresentAddressForm,
  StudentParentDetailsForm,
  StudentRegistrationForm
} from '@components/pages';
import { StudentApplyDomainForm } from '@components/pages/students-registration/student-apply-domain-form';
import { ScrollArea } from '@components/ui/scroll-area';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { useAuthContext } from '@context/auth';
import { useMutation } from 'react-query';
import { StudentRegistrationApplyDomainModel } from '@models/student/student-registration-apply-domain-model';
import {
  addAddressDetails,
  addFamilyDetails,
  addPersonalDetails,
  startRegistration
} from './_lib/function';
import {
  AddressDetailsType,
  DomainDetailsType,
  FamilyDetailsType,
  PersonalDetailsType,
  startRegisDetailType
} from './_lib/type';

const Model = StudentRegistrationModel.merge(
  StudentRegistrationApplyDomainModel
).superRefine((data, ctx) => {
  if (data.is_disabled === 'Yes' && data.disability_type === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Disability type is required if disabled is Yes',
      path: ['disability_type']
    });
    return false;
  } else {
    data.disability_type = data.disability_type || null;
  }
  return true;
});
type ModelType = z.infer<typeof Model>;

const Registration = () => {
  const { token } = useAuthContext();
  const [isRegisId, setIsRegisId] = useState<string>('');
  const formStyle: string = 'w-full sm:col-span-6 md:col-span-6 xl:col-span-4';
  const form = useForm<ModelType>({
    defaultValues: {
      batch_id: '9c66e87a-7399-4322-ab6e-5423bc29fb54'
    }
  });

  const domainApplyMutate = useCMutation({
    url: 'registration/add-domain-applied',
    method: 'POST',
    queryKey: []
  });

  const addAddressMutate = useMutation({
    mutationFn: (data: AddressDetailsType) =>
      addAddressDetails(token, isRegisId, data)
  });
  const addFamilyMutate = useMutation({
    mutationFn: (data: FamilyDetailsType) =>
      addFamilyDetails(token, isRegisId, data)
  });
  const startRegisMutate = useMutation({
    mutationFn: async (data: startRegisDetailType) =>
      await startRegistration(token, data),
    onError: (error: any) => {
      if (error instanceof Error) {
        showToast(FailedToastTitle, error.message);
        return;
      }
      if (error instanceof z.ZodError) {
        showToast(FailedToastTitle, error.errors[0].message);
        return;
      }
      if (error instanceof AxiosError) {
        showToast(FailedToastTitle, error.response?.data.message);
        return;
      }
      showToast(FailedToastTitle, error.message);
      return;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    startRegisMutate.isLoading
  );
  const addPersonalMutate = useMutation({
    mutationFn: async (data: PersonalDetailsType) =>
      await addPersonalDetails(token, isRegisId, data),
    onError: (error: any) => {
      if (error instanceof Error) {
        showToast(FailedToastTitle, error.message);
        return;
      }
      if (error instanceof z.ZodError) {
        showToast(FailedToastTitle, error.errors[0].message);
        return;
      }
      if (error instanceof AxiosError) {
        showToast(FailedToastTitle, error.response?.data.message);
        return;
      }
      showToast(FailedToastTitle, error.message);
      return;
    }
  });

  const onSubmit: SubmitHandler<ModelType> = async (datas) => {
    try {
      const data = Model.parse(datas);
      // Step 1: Start Registration
      const startPayload: startRegisDetailType = {
        dob: data.dob,
        first_name: data.first_name,
        middle_name: data.middle_name ?? null,
        last_name: data.last_name,
        registration_date: data.registration_date
      };
      await startRegisMutate.mutateAsync(startPayload);

      if (
        startRegisMutate.isError ||
        startRegisMutate.data?.data.success === false
      ) {
        throw new Error('Failed to start registration');
      }

      const registrationId = startRegisMutate.data.data.id;
      setIsRegisId(registrationId);
      if (!isRegisId) return;
      // Step 2: Add Personal Details
      const addPersonalPayload: PersonalDetailsType = {
        aadhaar: data.aadhaar ?? '',
        category: data.category,
        education: data.education,
        email: data.email ?? '',
        gender: data.gender,
        marital_status: data.marital_status,
        mobilisation_source: data.mobilisation_source ?? '',
        mobile: data.mobile,
        remarks: data.remarks ?? '',
        religion: data.religion,
        dob: data.dob,
        first_name: data.first_name,
        middle_name: data.middle_name ?? '',
        last_name: data.last_name,
        registration_date: data.registration_date
      };
      await addPersonalMutate.mutateAsync(addPersonalPayload);

      if (
        addPersonalMutate.isError ||
        addPersonalMutate.data?.success === false
      ) {
        throw new Error('Failed to add personal details');
      }

      // Step 3: Apply Domain
      const applyDomainPayload: DomainDetailsType = {
        registration_id: isRegisId,
        batch_id: data.batch_id,
        project_id: data.project_id,
        domain_id: [data.domain_id]
      };

      await domainApplyMutate.mutateAsync(applyDomainPayload);
      if (
        domainApplyMutate.isError ||
        domainApplyMutate.data?.data.success === false
      ) {
        throw new Error('Failed to apply domain');
      }

      // Step 4: Add Family Details
      const familyPayload: FamilyDetailsType = {
        father_age: data.father_age ?? '',
        father_income: data.father_income ?? '',
        father_last_name: data.father_last_name ?? '',
        father_mobile: data.father_mobile ?? '',
        father_name: data.father_name ?? '',
        father_occupation: data.father_occupation ?? '',
        head_of_family: data.head_of_family ?? '',
        mother_age: data.mother_age ?? '',
        mother_income: data.mother_income ?? '',
        mother_last_name: data.mother_last_name ?? '',
        mother_mobile: data.mother_mobile ?? '',
        mother_name: data.mother_name ?? '',
        mother_occupation: data.mother_occupation ?? ''
      };
      await addFamilyMutate.mutateAsync(familyPayload);

      if (addFamilyMutate.isError || addFamilyMutate.data?.success === false) {
        throw new Error('Failed to add family details');
      }

      // Step 5: Add Address Details
      const addressPayload: AddressDetailsType = {
        block: data.block ?? '',
        district: data.district ?? '',
        landmark: data.landmark ?? '',
        p_block: data.p_block ?? '',
        p_district: data.p_district ?? '',
        p_landmark: data.p_landmark ?? '',
        p_pin_code: data.p_pin_code ?? '',
        p_post_office: data.p_post_office ?? '',
        p_police_station: data.p_police_station ?? '',
        p_panchayat: data.p_panchayat ?? '',
        p_village: data.p_village ?? '',
        pin_code: data.pin_code ?? '',
        post_office: data.post_office ?? '',
        police_station: data.police_station ?? '',
        present_address: data.present_address ?? '',
        village: data.village ?? ''
      };
      await addAddressMutate.mutateAsync(addressPayload);
      if (
        addAddressMutate.isError ||
        addAddressMutate.data?.success === false
      ) {
        throw new Error('Failed to add address details');
      }

      showToast(SuccessToastTitle, 'Registration successful');
    } catch (error: any) {
      console.log(error);

      if (error instanceof z.ZodError) {
        showToast(FailedToastTitle, error.errors[0].message);
      } else if (error instanceof AxiosError) {
        showToast(FailedToastTitle, error.response?.data.message);
      } else {
        showToast(FailedToastTitle, error.message);
      }
    }
  };

  const formComponents: ReactElement[] = [
    <StudentRegistrationForm
      className={formStyle}
      key="Registration Form"
      form={form}
      loading={isLoading}
    />,
    <StudentPersonalDetailsForm
      className={formStyle}
      key="personal-details"
      form={form}
      loading={isLoading}
    />,
    <StudentParentDetailsForm
      key="parents-details"
      className={formStyle}
      form={form}
      loading={isLoading}
    />,
    <StudentPresentAddressForm
      key="present-address"
      className={formStyle}
      form={form}
      loading={isLoading}
    />,
    <StudentPermanentAddressForm
      key="permanent-address"
      className={formStyle}
      form={form}
      loading={isLoading}
    />,
    <StudentApplyDomainForm
      key="Apply Batch"
      className={formStyle}
      form={form}
      batchOptions={[]}
      loading={isLoading}
    />,
    <StudentOtherInfoForm key="other-info" className={formStyle} form={form} />
  ];
  return (
    <ScrollArea className="container">
      <div className="px-5 py-10">
        <div className="flex items-center justify-start">
          <Heading
            title="Student Registration"
            description="Follow the steps to complete your profile"
          />
        </div>
        <StepperForm form={form} onSubmit={onSubmit} steps={formComponents} />
      </div>
    </ScrollArea>
  );
};

export default Registration;
