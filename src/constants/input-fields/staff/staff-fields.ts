import { FormFieldType } from '@components/form/type';
import { gender, yesNoOptions } from '@constants/options';

export const staffFields: FormFieldType[] = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    required: true,
    type: 'email'
  },
  {
    name: 'phone',
    label: 'Phone',
    required: true
  },
  {
    name: 'address',
    label: 'Address',
    required: true
  },
  {
    name: 'gender',
    label: 'Gender',
    required: true,
    select: true,
    options: gender
  },
  {
    name: 'emergency_no',
    label: 'Emergency No',
    type: 'number'
  },
  {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date'
  },

  {
    name: 'doj',
    label: 'Date of Joining',
    type: 'date'
  },
  {
    name: 'create_username',
    label: 'Create Username',
    select: true,
    options: yesNoOptions
  }
];
