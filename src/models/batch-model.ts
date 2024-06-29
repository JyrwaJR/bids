import { z } from 'zod';
import { FieldsIsRequired } from '@src/constants';

export const BatchModel = z.object({
  domain_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid({
      message: 'Domain ID must be a valid UUID'
    }),
  project_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid({
      message: 'Project ID must be a valid UUID'
    }),
  batch_code: z
    .string({
      required_error: FieldsIsRequired
    })
    .max(10, {
      message: 'Batch code must be 10 characters or less'
    }),
  batchid: z
    .string({
      required_error: FieldsIsRequired
    })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Batch ID must be a number'
    }),
  start_date: z
    .string({
      required_error: FieldsIsRequired
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Start date must be a valid date'
    }),
  end_date: z
    .string({
      required_error: FieldsIsRequired
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'End date must be a valid date'
    }),
  capacity: z
    .string({
      required_error: FieldsIsRequired
    })
    .transform((val) => Number(val))
});

export type BatchModelType = z.infer<typeof BatchModel>;
