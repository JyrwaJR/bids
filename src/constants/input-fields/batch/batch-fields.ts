import { FormFieldType } from '@components/index';

export const batchFields: FormFieldType[] = [
  {
    name: 'batch_code',
    label: 'Batch Code',
    type: 'text',
    required: true
  },
  {
    name: 'batchid',
    label: 'Batch ID',
    type: 'number',
    required: true
  },
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
    name: 'capacity',
    label: 'Capacity',
    type: 'number'
  }
];
