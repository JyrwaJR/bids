import { FormFieldType } from '@src/components/form';

export const signupFields: FormFieldType[] = [
  {
    type: 'text',
    name: 'email',
    label: 'Email'
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password'
  },
  {
    type: 'password',
    name: 'confirmPassword',
    label: 'Confirm Password'
  }
];
