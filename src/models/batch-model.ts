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
  capacity: z.number({
    required_error: FieldsIsRequired
  }),
  duration: z.number({ required_error: FieldsIsRequired }),
  unit: z.enum(['hr', 'min'], {
    required_error: FieldsIsRequired
  })
});

export type BatchModelType = z.infer<typeof BatchModel>;
