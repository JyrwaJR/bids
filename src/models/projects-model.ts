import { FieldsIsRequired } from '@constants/index';
import { SectorsOptions } from '@constants/options';
import { format } from 'date-fns';
import { z } from 'zod';

export const ProjectModel = z.object({
  name: z
    .string({
      required_error: FieldsIsRequired
    })
    .max(250),
  target: z.number().transform((value) => Number(value)),
  start_date: z.date().transform((value) => format(value, 'yyyy-MM-dd')),
  end_date: z
    .date()
    .transform((value) => format(value, 'yyyy-MM-dd'))
    .nullable(),
  status: z.string().max(20),
  duration: z.number().transform((value) => Number(value)),
  target_sector: z
    .string()
    .max(20)
    .refine((val) => SectorsOptions.some((item) => item.value === val))
});

export type ProjectModelType = z.infer<typeof ProjectModel>;
