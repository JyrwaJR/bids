import { z } from 'zod';

import { FieldsIsRequired } from '@src/constants';

import { numberRegex } from '../constants/regex/number-regex';

export const CenterModel = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string({
      required_error: FieldsIsRequired
    })
    .min(3, {
      message: 'Should be more than 3 in length'
    })
    .max(100, {
      message: 'Should be less than 100 in length'
    }),
  email: z
    .string({
      required_error: FieldsIsRequired
    })
    .email({
      message: 'invalid Email'
    })
    .trim(),
  address: z
    .string({
      required_error: FieldsIsRequired
    })
    .min(3, {
      message: 'Should be more than 3 in length'
    })
    .max(250, {
      message: 'Should be less than 250 in length'
    }),
  gps: z
    .string({
      required_error: FieldsIsRequired
    })
    .min(3, {
      message: 'Should be more than 3 in length'
    })
    .max(50, {
      message: 'Should be less than 50 in length'
    }),
  contact: z
    .string({
      required_error: FieldsIsRequired
    })
    .regex(numberRegex, {
      message: 'Contact Should container only number'
    })
    .min(10, {
      message: 'Should be more than 10 in length'
    })
    .max(50, {
      message: 'Should be less than 50 in length'
    })
    .refine((val) => val.toString()),
  state_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .min(1, 'Please select state')
    .max(100, 'State must be 100 characters or less'),
  district_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .max(100, 'District must be 100 characters or less')
});

export type CenterModelType = z.infer<typeof CenterModel>;
