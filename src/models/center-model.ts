import { z } from 'zod';
import { FieldsIsRequired } from '@src/constants';
import { lettersAndSpacesRegex } from '@constants/regex';
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
    })
    .regex(lettersAndSpacesRegex, {
      message: 'Should contain only letters'
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
      message: 'Should be more than 3 in length'
    })
    .max(10, {
      message: 'Should be less than 50 in length'
    })
});

export type CenterModelType = z.infer<typeof CenterModel>;
