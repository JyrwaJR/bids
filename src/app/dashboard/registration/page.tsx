'use client';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StudentRegistrationModel } from '@models/student';
import { Heading } from '@components/ui/heading';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { z, ZodError } from 'zod';
import axios, { AxiosError } from 'axios';
import { useAuthContext } from '@context/auth';
import { useMutation, useQuery } from 'react-query';
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
import { zodResolver } from '@hookform/resolvers/zod';

import MultiStepForm, { StepType } from '@components/form/stepper-form';
import { FormFieldType, OptionsT } from '@components/form/type';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { studentRegistrationFields } from '@constants/input-fields/students';

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
async function getBatch(token: string, projectId?: string) {
  try {
    if (!projectId) return;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/batch/get-batch-by-centre/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}
const Registration = () => {
  const { token } = useAuthContext();
  const [isRegisId, setIsRegisId] = useState<string>('');
  const form = useForm<ModelType>({
    resolver: zodResolver(Model)
  });
  const [isSameAsPresent, setIsSameAsPresent] = useState<boolean>(false);
  const { options } = useCategorySelectOptions();
  const {
    data: batch,
    isFetched,
    isError
  } = useQuery({
    queryFn: async () => await getBatch(token, form.watch('project_id')),
    enabled: !!form.watch('project_id'),
    queryKey: form.watch('project_id')
  });
  const batchOptions: OptionsT[] | undefined =
    isFetched &&
    !isError &&
    batch.data.map((item: any) => ({
      label: item.batch_code,
      value: item.id
    }));

  const domainApplyMutate = useCMutation({
    url: 'registration/add-domain-applied',
    method: 'POST'
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
      await startRegistration(token, data)
  });

  const addPersonalMutate = useMutation({
    mutationFn: async (data: PersonalDetailsType) =>
      await addPersonalDetails(token, isRegisId, data)
  });

  const updatedFields: StepType[] = studentRegistrationFields.map(
    (element: StepType) => {
      const updatedFields = element.fields.map((field: FormFieldType) => {
        if (field.select) {
          switch (field.name) {
            case 'p_state':
              return { ...field, options: options.states };
            case 'p_district':
              return { ...field, options: options.district };
            case 'category':
              return { ...field, options: options.categories };
            case 'religion':
              return { ...field, options: options.religions };
            case 'marital_status':
              return { ...field, options: options.maritalStatus };
            case 'education':
              return { ...field, options: options.qualifications };
            case 'centre_id':
              return { ...field, options: options.centre };
            case 'project_id':
              return { ...field, options: options.projects };
            case 'domain_id':
              return { ...field, options: options.domain };
            case 'batch_id':
              return {
                ...field,
                options:
                  isFetched && batch.data.length > 0
                    ? batchOptions
                    : [
                        {
                          label: 'No Batch',
                          value: ''
                        }
                      ]
              };
            default:
              return field;
          }
        }
        return field;
      });

      return { ...element, fields: updatedFields };
    }
  );

  useEffect(() => {
    if (isSameAsPresent) {
      form.reset({
        ...form.getValues(),
        permanent_address: form.getValues('present_address'),
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
  const onSubmit: SubmitHandler<ModelType> = async (data) => {
    try {
      console.log('1');
      Model.parse(data);
      // Step 1: Start Registration
      const startPayload: startRegisDetailType = {
        dob: data.dob,
        first_name: data.first_name,
        middle_name: data.middle_name ?? null,
        last_name: data.last_name,
        registration_date: data.registration_date
      };
      console.log('3');
      await startRegisMutate.mutateAsync(startPayload);

      console.log('4');
      if (
        startRegisMutate.isError ||
        startRegisMutate.data?.data.success === false
      ) {
        throw new Error('Failed to start registration');
      }
      console.log('5');

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

      const formImage = new FormData();
      if (data.passport) {
        formImage.append('passport', data.passport && data.passport);
      }

      await addPersonalMutate.mutateAsync(addPersonalPayload);
      console.log('6');
      if (
        addPersonalMutate.isError ||
        addPersonalMutate.data?.success === false
      ) {
        throw new Error('Failed to add personal details');
        return;
      }

      console.log('7');
      // Step 3: Apply Domain
      const applyDomainPayload: DomainDetailsType = {
        registration_id: isRegisId,
        batch_id: data.batch_id,
        project_id: data.project_id,
        domain_id: [data.domain_id]
      };

      await domainApplyMutate.mutateAsync(applyDomainPayload);
      console.log('8');
      if (
        domainApplyMutate.isError ||
        domainApplyMutate.data?.data.success === false
      ) {
        throw new Error('Failed to apply domain');
      }
      console.log('9');

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
      console.log('10');

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
      console.log('11');
      if (
        addAddressMutate.isError ||
        addAddressMutate.data?.success === false
      ) {
        throw new Error('Failed to add address details');
      }
      console.log('12');
      showToast(SuccessToastTitle, 'Registration successful');
      console.log('13');
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
        steps={updatedFields}
      />
    </>
  );
};

export default Registration;
