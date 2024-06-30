import * as z from 'zod';

export const RegistrationPersonalRequestModel = z.object({
  admission_no: z.string().max(30).nullable(),
  registration_date: z
    .date()
    .refine((value) => value instanceof Date && !isNaN(value.getTime()), {
      message: 'Invalid date format'
    }),
  aadhaar: z.string().max(12).nullable(),
  first_name: z.string().max(80),
  middle_name: z.string().max(50).nullable(),
  last_name: z.string().max(50),
  dob: z
    .date()
    .refine((value) => value instanceof Date && !isNaN(value.getTime()), {
      message: 'Invalid date format'
    }),
  gender: z.string().max(10),
  category: z.string().max(5),
  mobile: z.string().max(10),
  email: z.string().max(80).nullable(),
  religion: z.string().max(50),
  marital_status: z.string().max(50),
  education: z.string().max(50),
  mobilisation_source: z.string().max(100).nullable(),
  remarks: z.string().nullable(),
  passport: z.string().max(100).nullable()
});

export type RegistrationPersonalRequestModelType = z.infer<
  typeof RegistrationPersonalRequestModel
>;
