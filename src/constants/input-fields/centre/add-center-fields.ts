import { FormFieldType } from '@src/components';

export const addCenterFields: FormFieldType[] = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'email',
    label: 'Email Address',
    required: true,
    type: 'email'
  },
  {
    name: 'address',
    label: 'Address',
    required: true
  },
  {
    name: 'gps',
    label: 'GPS Location',
    required: true
  },
  {
    name: 'contact',
    label: 'Contact No.',
    required: true
  }
];
