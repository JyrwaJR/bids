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
  startRegistration,
  StudentRegistrationModelWithDomain,
  StudentRegistrationModelWithDomainType
} from './_lib/function';

import { zodResolver } from '@hookform/resolvers/zod';

import MultiStepForm, { StepType } from '@components/form/stepper-form';
import { FormFieldType, OptionsT } from '@components/form/type';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { studentRegistrationFields } from '@constants/input-fields/students';
import { axiosInstance } from '@lib/utils';
import { yesNoOptions } from '@constants/options';

async function getBatch(projectId?: string) {
  try {
    if (!projectId) return;
    const res = await axiosInstance.get(
      `/batch/get-batch-by-centre/${projectId}`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}
const getStudentDataIfExist = async (id: string) => {
  try {
    if (!id) return;
    const res = await axiosInstance.get(`/registration/search-student`, {
      params: {
        search: '2024-07-11'
      }
    });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

const Registration = () => {
  const [isSameAsPresent, setIsSameAsPresent] = useState<boolean>(false);
  const { options } = useCategorySelectOptions();
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

  const batchQuery = useQuery({
    queryFn: async () => await getBatch(form.watch('project_id')),
    enabled: !!form.watch('project_id'),
    queryKey: form.watch('project_id')
  });

  const batchOptions: OptionsT[] | undefined =
    batchQuery.isFetched &&
    !batchQuery.isError &&
    batchQuery.data &&
    batchQuery.data.map((item: any) => ({
      label: item.batch_code,
      value: item.id
    }));

  const studentQuery = useQuery({
    queryFn: async () => await getStudentDataIfExist(form.watch('first_name')),
    enabled: !!form.watch('first_name'),
    queryKey: form.watch('first_name')
  });

  console.log(studentQuery.data);

  const startRegisMutate = useMutation({
    mutationFn: async (data: StudentRegistrationModelWithDomainType) =>
      await startRegistration(data)
  });

  const isBplField: FormFieldType[] =
    form.watch('is_bpl') === 'Yes'
      ? [
          {
            name: 'bpl_card_no',
            label: 'BPL Card No'
          },
          {
            name: 'bpl_card_issue',
            label: 'BPL Card Issue Date',
            type: 'date'
          },
          {
            name: 'is_bpl_certified',
            label: 'Is BPL Certified',
            select: true,
            options: yesNoOptions
          },
          {
            name: 'bpl_certification_authority',
            label: 'BPL Certification Authority',
            select: true,
            options: yesNoOptions
          },
          {
            name: 'bpl_other_certifying_authority',
            label: 'BPL Other Certifying Authority',
            select: true,
            options: yesNoOptions
          },
          {
            name: 'bpl_certificate_issue_date',
            label: 'BPL Certificate Issue Date',
            type: 'date'
          }
        ]
      : [];
  const fieldInput: StepType[] = [
    ...studentRegistrationFields,
    {
      id: '5',
      name: 'Other Details',
      fields: [
        {
          name: 'is_technical_education',
          label: 'Technical Education',
          required: false,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'diploma_certificate',
          label: 'Diploma Certificate',
          required: false,
          type: 'text',
          placeholder: 'Enter Diploma Certificate'
        },
        {
          name: 'year_passing',
          label: 'Year Passing',
          required: false,
          type: 'date',
          placeholder: 'Enter Year Passing'
        },
        {
          name: 'is_employed',
          label: 'Employed',
          required: false,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'occupation',
          label: 'Occupation',
          required: false,
          type: 'text',
          placeholder: 'Enter Occupation'
        },
        {
          name: 'year_experience',
          label: 'Years of Experience',
          required: false,
          type: 'number',
          placeholder: 'Enter Years of Experience'
        },
        {
          name: 'monthly_income',
          label: 'Monthly Income',
          required: false,
          type: 'number',
          placeholder: 'Enter Monthly Income'
        },
        {
          name: 'is_bpl',
          label: 'BPL (Below Poverty Line)',
          required: false,
          select: true,
          options: yesNoOptions
        },
        ...isBplField,
        {
          name: 'hostel_required',
          label: 'Hostel Required',
          required: false,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'will_migrate',
          label: 'Will Migrate',
          required: false,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'is_minority',
          label: 'Is Minority',
          required: false,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'is_disabled',
          label: 'Is Disabled',
          required: false,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'disability_type',
          label: 'Disability Type',
          required: false,
          select: true
        },
        {
          name: 'family_size',
          label: 'Family Size',
          required: false,
          type: 'number',
          placeholder: 'Enter Family Size'
        },
        {
          name: 'catchment_area',
          label: 'Catchment Area',
          required: false,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'nre_job_card_no',
          label: 'NRE Job Card No',
          required: false,
          type: 'text',
          placeholder: 'Enter NRE Job Card No'
        },
        {
          name: 'mgnrega_hours_worked',
          label: 'MGNREGA Hours Worked',
          required: false,
          type: 'number',
          placeholder: 'Enter MGNREGA Hours Worked'
        }
      ]
    }
  ];
  const updatedFields: StepType[] = fieldInput.map((element: StepType) => {
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
                batchQuery.isFetched && batchQuery.data ? batchOptions : []
            };
          default:
            return field;
        }
      }
      return field;
    });

    return { ...element, fields: updatedFields };
  });

  const onSubmit: SubmitHandler<
    StudentRegistrationModelWithDomainType
  > = async (data) => {
    try {
      StudentRegistrationModelWithDomain.parse(data);
      const response = await startRegisMutate.mutateAsync(data);
      console.log(response);

      if (response.data.success) {
        showToast(SuccessToastTitle, 'Registration successful');
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
        steps={updatedFields}
      />
    </>
  );
};

export default Registration;
