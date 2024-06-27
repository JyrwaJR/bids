import { FormFieldType } from '@src/components';

export const addCenterFields: FormFieldType[] = [
  {
    name: 'email',
    label: 'Email Address',
    required: true,
    type: 'email'
  },
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'address',
    label: 'Address',
    required: true
  },
  {
    name: 'gps',
    label: 'GPS',
    required: true
  },
  {
    name: 'contact',
    label: 'Contact No',
    required: true,
    type: 'tel'
  }
];
