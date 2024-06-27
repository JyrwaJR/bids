import { FormFieldType } from '@components/index';
import { StatusOptions } from '@constants/options';

export const domainFields: FormFieldType[] = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'status',
    label: 'Status',
    select: true,
    options: StatusOptions
  },
  {
    name: 'level',
    label: 'Level',
    type: 'number'
  }
];
