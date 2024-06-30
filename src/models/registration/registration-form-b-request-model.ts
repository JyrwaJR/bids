import * as z from 'zod';

export const RegistrationFormBRequestModel = z.object({
  is_technical_education: z.string().max(3).nonempty(),
  diploma_certificate: z.string().max(100).nullable(),
  year_passing: z.number().int().nullable(),
  is_employed: z.string().max(3).nonempty(),
  occupation: z.string().max(50).nullable(),
  year_experience: z.number().nullable(),
  monthly_income: z.number().int().nullable(),
  is_bpl: z.string().max(3).nonempty(),
  hostel_required: z.string().max(3).nonempty(),
  will_migrate: z.string().max(3).nonempty(),
  is_minority: z.string().max(3).nonempty(),
  is_disabled: z.string().max(3).nonempty(),
  disability_type: z.string().max(250).nullable(),
  family_size: z.number().int().nullable(),
  catchment_area: z.string().max(3).nonempty(),
  nre_job_card_no: z.string().max(50).nullable(),
  mgnrega_hours_worked: z.number().int().nullable()
});

export type RegistrationFormBRequestType = z.infer<
  typeof RegistrationFormBRequestModel
>;
