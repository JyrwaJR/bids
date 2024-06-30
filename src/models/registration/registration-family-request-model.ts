import * as z from 'zod';

export const RegistrationFamilyRequestModel = z.object({
  father_name: z.string().max(80).nullable(),
  father_last_name: z.string().max(80).nullable(),
  father_mobile: z.string().max(10).nullable(),
  father_age: z.number().int().nullable(),
  father_occupation: z.string().max(50).nullable(),
  father_income: z.number().int().nullable(),
  mother_name: z.string().max(80).nullable(),
  mother_last_name: z.string().max(80).nullable(),
  mother_mobile: z.string().max(10).nullable(),
  mother_age: z.number().int().nullable(),
  mother_occupation: z.string().max(50).nullable(),
  mother_income: z.number().int().nullable(),
  head_of_family: z.string().nullable()
});

export type RegistrationFamilyRequestModelType = z.infer<
  typeof RegistrationFamilyRequestModel
>;
