import { z } from 'zod';

import { FieldsIsRequired } from '@constants/index';
import { yesNoOptions } from '@constants/options';
import { lettersAndSpacesRegex } from '@constants/regex';
import { PasswordRegex } from '@constants/regex/password-regex';

export const StaffModel = z
  .object({
    name: z
      .string({ required_error: FieldsIsRequired })
      .min(3, {
        message: 'Name must be at least 3 character'
      })
      .max(100, 'Name must be at most 100 characters long')
      .regex(lettersAndSpacesRegex, {
        message: 'Name must contained only alphabet'
      }),
    email: z.string({ required_error: FieldsIsRequired }).email({
      message: 'Invalid email address'
    }),
    phone: z
      .string({ required_error: FieldsIsRequired })
      .min(10, {
        message: 'Should contained at least 10 no '
      })
      .max(10, 'Phone number must be at most 10 characters long'),
    address: z
      .string({ required_error: FieldsIsRequired })
      .min(3)
      .max(250, 'Address must be at most 250 characters long'),
    staff_category_id: z
      .string({ required_error: FieldsIsRequired })
      .uuid('Invalid staff category ID'),
    centre_id: z
      .string({ required_error: FieldsIsRequired })
      .uuid('Invalid centre ID'),
    gender: z.enum(['Male', 'Female', 'Other'], {
      required_error: 'Invalid gender'
    }),
    emergency_no: z
      .string()
      .max(10, 'Phone number must be at most 10 characters long')
      .optional()
      .nullable(),
    dob: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid date of birth'),
    doj: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid date of joining'),

    password: z.string().optional(),
    create_username: z
      .string()
      .refine((data) => yesNoOptions.some((opt) => opt.value === data), {
        message: 'Invalid value'
      })
  })
  .superRefine((val, ctx) => {
    if (val.create_username === 'Yes' && !val.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password is required to create username',
        path: ['password']
      });
    }
    if (
      val.create_username === 'Yes' &&
      !PasswordRegex.test(val.password ?? '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a strong password',
        path: ['password']
      });
    }
  });

export type StaffModelType = z.infer<typeof StaffModel>;
