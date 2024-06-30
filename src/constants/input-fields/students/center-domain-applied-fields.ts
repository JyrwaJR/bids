import { FormFieldType } from '@components/index';

export const createDomainAppliedFields: FormFieldType[] = [
  {
    name: 'registration_id',
    label: 'Registration ID',
    required: true,
    type: 'text',
    placeholder: 'Enter registration ID'
  },
  {
    name: 'domain_id',
    label: 'Domain ID',
    required: true,
    type: 'text',
    placeholder: 'Enter domain ID'
  },
  {
    name: 'centre_id',
    label: 'Centre ID',
    required: true,
    type: 'text',
    placeholder: 'Enter centre ID'
  },
  {
    name: 'status',
    label: 'Status',
    required: true,
    type: 'text',
    placeholder: 'Enter status'
  },
  {
    name: 'created_at',
    label: 'Created At',
    type: 'date',
    placeholder: 'Select date'
  },
  {
    name: 'updated_at',
    label: 'Updated At',
    type: 'date',
    placeholder: 'Select date'
  }
];
