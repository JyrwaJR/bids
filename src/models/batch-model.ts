import { z } from 'zod';
import { FieldsIsRequired } from '@src/constants';

export const BatchModel = z.object({
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
  }),
  trainer_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid({
      message: 'Trainer ID must be a valid UUID'
    }),
  support_trainer_id: z.string().uuid().optional()
});

export type BatchModelType = z.infer<typeof BatchModel>;
