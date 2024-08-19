import { FormFieldType } from '@components/index';

export const batchFields: FormFieldType[] = [
  {
    name: 'start_date',
    label: 'Start Date',
    type: 'date'
  },
  {
    name: 'end_date',
    label: 'End Date',
    type: 'date'
  },
  {
    name: 'duration',
    label: 'Duration/class',
    type: 'number',
    helperText: 'in minutes/hours'
  },
  {
    name: 'unit',
    label: 'Unit',
    select: true,
    options: [
      { label: 'Hour', value: 'hr' },
      { value: 'min', label: 'Minute' }
    ]
  },
  {
    name: 'capacity',
    label: 'Capacity',
    type: 'number'
  }
];
