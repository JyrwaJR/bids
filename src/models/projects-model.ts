import { FieldsIsRequired } from '@constants/index';
import { SectorsOptions } from '@constants/options';
import { format } from 'date-fns';
import { z } from 'zod';

export const ProjectModel = z.object({
  centre_id: z.string().uuid().optional(),
  domain_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid()
    .array(),
  name: z
    .string({
      required_error: FieldsIsRequired
    })
    .max(250),
  target: z
    .number({
      required_error: FieldsIsRequired
    })
    .positive({
      message: 'Should be positive'
    }),
  start_date: z
    .string()
    .refine((value) => format(new Date(value), 'yyyy-MM-dd')),
  end_date: z
    .string()
    .refine((value) => format(new Date(value), 'yyyy-MM-dd'))
    .nullable(),
  status: z.string().max(20),
  duration: z.number().positive({ message: 'Should be positive' }),
  target_sector: z
    .string()
    .max(20)
    .refine((val) => SectorsOptions.some((item) => item.value === val))
});

export type ProjectModelType = z.infer<typeof ProjectModel>;
