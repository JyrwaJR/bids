import { gender } from '@constants/options';
import { phoneNoRegex } from '@constants/regex';
import { fileValidation } from '@models/domain-model';
import { format, parse } from 'date-fns';
import * as z from 'zod';

export const StudentRegistrationModel = z.object({
  id: z.string().uuid().optional().nullable(),
  registration_no: z.string().uuid().optional(),
  admission_no: z.string().max(30).nullable().optional(),
  // registration_date: z.string().optional(),
  aadhaar: z.string().length(12).nullable().optional(),
  first_name: z.string({ required_error: 'First name is required' }).max(80),
  middle_name: z.string().max(50).nullable().optional(),
  last_name: z.string({ required_error: 'Last name is required' }).max(50),
  dob: z
    .string()
    .transform((val) =>
      val.includes('/')
        ? format(parse(val as string, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
        : val
    ),
  gender: z
    .string({ required_error: 'Gender is required' })
    .max(10)
    .refine((val) => gender.some((g) => g.value === val)),
  category: z.string().max(8).default('ST'),
  mobile: z.string({ required_error: 'Mobile number is required' }).length(10),
  email: z.string().email().max(80).nullable().optional(),
  religion: z
    .string({ required_error: 'Religion is required' })
    .max(50)
    .default('Christian'),
  marital_status: z.string().max(50),
  education: z.string({ required_error: 'Education is required' }).max(50),
  mobilisation_source: z.string().max(100).nullable().optional(),
  remarks: z.string().nullable().optional(),
  passport: fileValidation.optional(),
  // Parents details
  father_name: z.string().max(80).nullable().optional(),
  father_last_name: z.string().max(80).nullable().optional(),
  father_mobile: z
    .string()
    .min(10)
    .max(10)
    .regex(phoneNoRegex, {
      message: 'Invalid mobile number'
    })
    .nullable()
    .optional(),
  father_age: z.number().nullable().optional(),
  father_occupation: z.string().max(50).nullable().optional(),
  father_income: z.number().nullable().optional(),
  mother_name: z.string().max(80).nullable().optional(),
  mother_last_name: z.string().max(80).nullable().optional(),
  mother_mobile: z
    .string()
    .min(10)
    .max(10)
    .regex(phoneNoRegex, {
      message: 'Invalid mobile number'
    })
    .nullable()
    .optional(),
  mother_age: z.number().nullable().optional(),
  mother_occupation: z.string().max(50).nullable().optional(),
  mother_income: z.number().int().nullable().optional(),
  head_of_family: z.string().nullable().optional(),
  // Present Address
  resident_type: z
    .string({ required_error: 'Resident type is required' })
    .max(10),
  landmark: z.string().max(255).nullable().optional(),
  present_address: z.string().max(255).nullable().optional(),
  village: z.string().max(60).nullable().optional(),
  panchayat: z.string().max(60).nullable().optional(),
  block: z.string().max(60).nullable().optional(),
  police_station: z.string().max(60).nullable().optional(),
  post_office: z.string().max(60).nullable().optional(),
  district: z.string().max(60).nullable().optional(),
  state: z.string().max(60).nullable().optional(),
  pin_code: z.string().length(6).nullable().optional(),
  // Permanent Address
  p_address: z.string().max(255).nullable().optional(),
  p_landmark: z.string().max(255).nullable().optional(),
  p_village: z.string().max(60).nullable().optional(),
  p_panchayat: z.string().max(60).nullable().optional(),
  p_block: z.string().max(60).nullable().optional(),
  p_police_station: z.string().max(60).nullable().optional(),
  p_post_office: z.string().max(60).nullable().optional(),
  p_district: z.string().max(60).nullable().optional(),
  p_state: z.string().max(60).nullable().optional(),
  p_pin_code: z
    .string()
    .refine((val) => val.toString())
    .nullable()
    .optional(),
  // Other Info
  is_technical_education: z.enum(['Yes', 'No']),
  diploma_certificate: z.string().max(100).nullable().optional(),
  // convert string to number
  year_passing: z
    .number()
    .refine((val) => format(new Date(val), 'yyyy-MM-dd'))
    .nullable()
    .optional(),
  is_employed: z.enum(['Yes', 'No']).default('No'),
  occupation: z.string().max(50).nullable().optional(),
  year_experience: z
    .number({ required_error: 'Year of experience is required' })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Invalid number'
    })
    .transform((val) => Number(val))
    .nullable()
    .optional(),
  monthly_income: z
    .number({ required_error: 'Monthly income is required' })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Invalid number'
    })
    .transform((val) => Number(val))
    .nullable()
    .optional(),
  is_bpl: z.enum(['Yes', 'No']).default('No'),
  hostel_required: z.enum(['Yes', 'No']).default('No'),
  will_migrate: z.enum(['Yes', 'No']).default('No'),
  is_minority: z.enum(['Yes', 'No']).default('No'),
  is_disabled: z.enum(['Yes', 'No']).default('No'),
  disability_type: z.string().max(250).nullable().optional(),
  family_size: z
    .number({ required_error: 'Family size is required' })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Invalid number'
    })
    .transform((val) => Number(val))
    .nullable()
    .optional(),
  catchment_area: z.enum(['Yes', 'No']).default('No'),
  nre_job_card_no: z.string().max(50).nullable().optional(),
  mgnrega_hours_worked: z
    .number({ required_error: 'Mgnrega hours worked is required' })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Invalid number'
    })
    .transform((val) => Number(val))
    .nullable()
    .optional(),
  status: z.string().max(20).default('Applied'),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  bpl_card_no: z.string().max(50).nullable().optional(),
  bpl_card_issue: z
    .string()
    .refine((val) => format(new Date(val), 'yyyy-MM-dd'), {
      message: 'Invalid date'
    })
    .nullable()
    .optional(),
  is_bpl_certified: z.enum(['Yes', 'No']).default('No'),
  bpl_certification_authority: z.string().max(100).nullable().optional(),
  bpl_other_certifying_authority: z.string().max(100).nullable().optional(),
  bpl_certificate_issue_date: z
    .string()
    .refine((val) => format(new Date(val), 'yyyy-MM-dd'), {
      message: 'Invalid date'
    })
    .nullable()
    .optional()
});

export type StudentRegistrationModelType = z.infer<
  typeof StudentRegistrationModel
>;
