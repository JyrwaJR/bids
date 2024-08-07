import { FieldsIsRequired } from '@constants/index';
import { format } from 'date-fns';
import { z } from 'zod';

export const AttendanceModel = z.object({
  id: z.string().uuid().optional(),
  batch_id: z.string({ required_error: FieldsIsRequired }),
  student_id: z.string({ required_error: FieldsIsRequired }).uuid().array(),
  date: z
    .string({ required_error: FieldsIsRequired })
    .refine((v) => format(new Date(v), 'yyy-MM-dd') !== 'invalid date'),
  status: z.string().array().optional()
});
export type AttendanceModelType = z.infer<typeof AttendanceModel>;
