import { FieldsIsRequired } from '@constants/index';
import { StatusOptions } from '@constants/options';
import { lettersAndSpacesRegex } from '@constants/regex';
import { z } from 'zod';

export const DomainModel = z.object({
  id: z.string().uuid().optional(),
  sector_id: z.string({
    required_error: FieldsIsRequired
  }),
  name: z
    .string({
      required_error: FieldsIsRequired
    })
    .min(3, {
      message: 'Should be more than 3 in length'
    })
    .max(155, {
      message: 'Should be less than 155 in length'
    })
    .regex(lettersAndSpacesRegex, {
      message: 'Should contain only letters'
    }),
  status: z
    .string({
      required_error: FieldsIsRequired
    })
    .max(10, {
      message: 'Should be less than 10 in length'
    })
    .refine((val) => StatusOptions.some((opt) => opt.value === val), {
      message: 'Invalid value'
    }),
  level: z
    .string({
      required_error: FieldsIsRequired
    })
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error('Invalid number');
      }
      return parsed;
    })
    .refine(
      (data) => {
        return typeof data === 'number' && !isNaN(data);
      },
      {
        message: 'Must be a valid number'
      }
    ),
  op_code: z
    .string({
      required_error: FieldsIsRequired
    })
    .max(10, {
      message: 'Should be less than 10 in length'
    })
    .optional(),
  last_review: z
    .string({
      required_error: FieldsIsRequired
    })
    .optional(),
  next_review: z
    .string({
      required_error: FieldsIsRequired
    })
    .optional()
});
export type DomainModelType = z.infer<typeof DomainModel>;
