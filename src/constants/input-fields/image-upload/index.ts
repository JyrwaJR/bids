import { FormFieldType } from '@components/index';

export const imageUploadFields: FormFieldType[] = [
  {
    name: 'pan_card',
    label: 'Pan Card',
    type: 'file'
  },
  {
    name: 'pan_card_no',
    label: 'Pan Card Number',
    type: 'text'
  },
  {
    name: 'aadhar_card',
    label: 'Aadhar Card',
    type: 'file'
  },
  {
    name: 'aadhar_card_no',
    label: 'Aadhar Number',
    type: 'file'
  }
];
