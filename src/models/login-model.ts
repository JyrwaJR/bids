import z from 'zod';

import {
  oneLowerCaseRegex,
  oneNumberRegex,
  oneSpecialCharacterOrSpace,
  oneUpperCaseRegex
} from '@src/constants/regex';

export const LoginModel = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email({
      message: 'Please enter a valid email address'
    })
    .trim(),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(8, {
      message: 'Should contain at least 8 character'
    })
    .max(100)

    .regex(oneLowerCaseRegex, {
      message: 'Should contain at least one lowercase letter'
    })
    .regex(oneNumberRegex, {
      message: 'Should contain at least one number'
    })
    .regex(oneSpecialCharacterOrSpace, {
      message: 'Should contain at least one special character'
    })
    .regex(oneUpperCaseRegex, {
      message: 'Should contain at least one uppercase letter'
    })
});

export type LoginModelType = z.infer<typeof LoginModel>;
