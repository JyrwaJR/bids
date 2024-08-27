import { FormFieldType } from '@components/index';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { UseFormReturn, useWatch } from 'react-hook-form';
import {
  getBatch,
  getDomainByProjectId,
  StudentRegistrationModelWithDomainType
} from './function';
import { yesNoOptions } from '@constants/options';
import { studentRegistrationFields } from '@constants/input-fields/students';
import { useQuery } from 'react-query';
import { OptionsT } from '@components/form/type';
import { useCallback, useEffect, useState } from 'react';
import { batchQueryKey, domainQueryKey } from '@constants/query-keys';
import { StepType } from '@components/form/registration-stepper-form';
import { studentImageUploadFields } from '@constants/input-fields/students/student-registration-fields';
import { StudentRegistrationModelType } from '@models/student';

type Props = {
  form: UseFormReturn<StudentRegistrationModelType>;
};
const employedMentorOptions: OptionsT[] = [
  {
    label: 'Yes',
    value: 'yes'
  },
  {
    label: 'No',
    value: 'no'
  },
  {
    label: 'Self Employed',
    value: 'self'
  }
];
const emptyOptions: OptionsT[] = [
  {
    label: 'N/A',
    value: ''
  }
];
export const useRegistrationFields = ({ form }: Props) => {
  const { options } = useCategorySelectOptions();
  const [projectId, setProjectId] = useState('');
  const batchQuery = useQuery({
    queryFn: async () => await getBatch(form.watch('project_id')),
    enabled: !!form.watch('project_id'),
    queryKey: [batchQueryKey, form.watch('project_id')]
  });
  const domainQuery = useQuery({
    queryFn: async () => await getDomainByProjectId(form.watch('project_id')),
    enabled: !!form.watch('project_id'),
    queryKey: [
      domainQueryKey,
      batchQueryKey,
      form.watch('project_id'),
      form.watch('batch_id')
    ]
  });
  const refetchDomainQuery = useCallback(() => {
    domainQuery.refetch();
  }, [domainQuery]);
  const watchIsDisabled = useWatch({
    name: 'is_disabled',
    control: form.control
  });
  const watchIsTechnical = useWatch({
    name: 'is_technical_education',
    control: form.control
  });
  const handleProjectIdChange = useCallback(() => {
    const currentProjectId = form.watch('project_id');
    if (currentProjectId !== projectId) {
      refetchDomainQuery();
      form.setValue('domain_id', '');
      form.setValue('batch_id', '');
      setProjectId(currentProjectId);
    }
  }, [form, projectId, refetchDomainQuery, setProjectId]);

  useEffect(() => {
    handleProjectIdChange();
  }, [handleProjectIdChange]);

  const domainOptions: OptionsT[] =
    domainQuery.isFetched &&
    !domainQuery.isLoading &&
    !domainQuery.isError &&
    domainQuery.data &&
    domainQuery.data.data.map(
      (item: { domain_id: string; domain: string }) => ({
        label: item.domain,
        value: item.domain_id
      })
    );

  const batchOptions: OptionsT[] =
    batchQuery.isFetched &&
    !batchQuery.isLoading &&
    !batchQuery.isError &&
    batchQuery.data &&
    batchQuery.data.data.map((item: { id: string; batch_code: string }) => ({
      label: item.batch_code,
      value: item.id
    }));

  const isBplField: FormFieldType[] =
    form.watch('is_bpl') === 'Yes'
      ? [
          {
            name: 'bpl_card_no',
            label: 'BPL Card No'
          },
          {
            name: 'bpl_card_issue',
            type: 'number',
            label: 'BPL Card Issue'
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
          required: true,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'diploma_certificate',
          label: 'Diploma Certificate',
          readOnly: watchIsTechnical === 'No',
          required: false,
          type: 'text',
          placeholder: 'Enter Diploma Certificate'
        },
        {
          name: 'year_passing',
          label: 'Year Passing',
          readOnly: watchIsTechnical === 'No',
          required: false,
          type: 'number',
          placeholder: 'Enter Year Passing'
        },
        {
          name: 'is_employed',
          label: 'Employed',
          required: false,
          select: true,
          options: employedMentorOptions
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
          label: 'Disabled',
          required: false,
          select: true,
          options: yesNoOptions
        },
        {
          name: 'disability_type',
          label: 'Disability Type',
          required: watchIsDisabled === 'Yes' ? true : false,
          readOnly: watchIsDisabled === 'Yes' ? false : true,
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
    },
    {
      name: 'Upload Documents',
      id: 'Upload Documents',
      fields: studentImageUploadFields
    },
    {
      id: '6',
      name: 'Preview',
      fields: []
    }
  ];

  const updatedFields: StepType[] = fieldInput.map((element: StepType) => {
    const updatedFields = element.fields.map((field: FormFieldType) => {
      if (field.select) {
        switch (field.name) {
          case 'state':
            return { ...field, options: options.states };
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
          case 'disability_type':
            return { ...field, options: options.disabilities };
          case 'domain_id':
            return {
              ...field,
              options:
                domainQuery.isFetched && domainQuery.data
                  ? domainOptions
                  : emptyOptions
            };
          case 'batch_id':
            return {
              ...field,
              options:
                batchQuery.isFetched && batchQuery.data
                  ? batchOptions
                  : emptyOptions
            };
          default:
            return field;
        }
      }
      return field;
    });
    return { ...element, fields: updatedFields };
  });
  return { field: updatedFields };
};
