import { FormFieldType } from '@components/index';

export const batchFields: FormFieldType[] = [
  {
    name: 'start_date',
    label: 'Start Date',
    type: 'date',
    required: true
  },
  {
    name: 'end_date',
    label: 'End Date',
    type: 'date',
    required: true
  },
  {
    name: 'duration',
    label: 'Duration/class',
    type: 'number',
    helperText: 'in minutes/hours',
    required: true
  },
  {
    name: 'unit',
    label: 'Hour or Min unit',
    select: true,
    required: true,
    options: [
      { label: 'Hour', value: 'hr' },
      { value: 'min', label: 'Minute' }
    ]
  },
  {
    name: 'capacity',
    label: 'Capacity',
    type: 'number',
    required: true
  }
];
