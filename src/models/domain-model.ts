import { FieldsIsRequired } from '@constants/index';
import { StatusOptions } from '@constants/options';
import { lettersAndSpacesRegex } from '@constants/regex';
import { format } from 'date-fns';
import { z } from 'zod';
const ACCEPTED_FILES_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/svg'
];

export const fileValidation = z
  .instanceof(File, {
    message: 'Please select an image'
  })
  .refine((file) => file && file.size <= 1024 * 1024 * 10, {
    message: 'File size must be less than 10MB'
  })
  .refine((file) => file && ACCEPTED_FILES_TYPES.includes(file.type), {
    message: 'File must be a PNG/jpg/jpeg'
  });

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
    .number({
      required_error: FieldsIsRequired
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
    .optional(),
  qp_code: z.string({ required_error: FieldsIsRequired }).max(10),
  curriculum: fileValidation.optional(),
  guide: fileValidation.optional(),
  approval_date: z
    .string()
    .refine((val) => format(new Date(val), 'yyyy-MM-dd'))
    .optional(),
  duration: z.number({ required_error: FieldsIsRequired }).int().positive()
});
export type DomainModelType = z.infer<typeof DomainModel>;
