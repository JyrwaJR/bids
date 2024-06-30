import { gender } from '@constants/options';
import { format } from 'date-fns';
import * as z from 'zod';

export const StudentRegistrationModel = z
  .object({
    centre_id: z.string().uuid(),
    registration_no: z.string().uuid(),
    admission_no: z.string().max(30).nullable().optional(),
    registration_date: z
      .string()
      .refine((val) => format(new Date(val), 'yyyy-MM-dd') !== 'Invalid Date'),
    aadhaar: z.string().length(12).nullable().optional(),
    first_name: z.string().max(80),
    middle_name: z.string().max(50).nullable().optional(),
    last_name: z.string().max(50),
    dob: z
      .string()
      .refine((val) => format(new Date(val), 'yyyy-MM-dd') !== 'Invalid Date'),
    gender: z
      .string()
      .max(10)
      .refine((val) => gender.some((g) => g.value === val)),
    category: z.string().max(5).default('ST'),
    mobile: z.string().length(10),
    email: z.string().email().max(80).nullable().optional(),
    religion: z.string().max(50),
    marital_status: z.string().max(50).default('Unmarried'),
    education: z.string().max(50),
    mobilisation_source: z.string().max(100).nullable().optional(),
    remarks: z.string().nullable().optional(),
    passport: z.string().max(100).nullable().optional(),
    // Parents details
    father_name: z.string().max(80).nullable().optional(),
    father_last_name: z.string().max(80).nullable().optional(),
    father_mobile: z.string().length(10).nullable().optional(),
    father_age: z.string().nullable().optional(),
    father_occupation: z.string().max(50).nullable().optional(),
    father_income: z.string().nullable().optional(),
    mother_name: z.string().max(80).nullable().optional(),
    mother_last_name: z.string().max(80).nullable().optional(),
    mother_mobile: z.string().length(10).nullable().optional(),
    mother_age: z.string().nullable().optional(),
    mother_occupation: z.string().max(50).nullable().optional(),
    mother_income: z.number().int().nullable().optional(),
    head_of_family: z.string().nullable().optional(),
    // Present Address
    resident_type: z.string().max(10).default('Rural'),
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
    permanent_address: z.string().max(255).nullable().optional(),
    p_landmark: z.string().max(255).nullable().optional(),
    p_village: z.string().max(60).nullable().optional(),
    p_panchayat: z.string().max(60).nullable().optional(),
    p_block: z.string().max(60).nullable().optional(),
    p_police_station: z.string().max(60).nullable().optional(),
    p_post_office: z.string().max(60).nullable().optional(),
    p_district: z.string().max(60).nullable().optional(),
    p_state: z.string().max(60).nullable().optional(),
    p_pin_code: z.string().length(6).nullable().optional(),
    // Other Info
    is_technical_education: z.enum(['Yes', 'No']).default('No'),
    diploma_certificate: z.string().max(100).nullable().optional(),
    // convert string to number
    year_passing: z
      .string()
      .refine((val) => format(new Date(val), 'yyyy-MM-dd'))
      .nullable()
      .optional(),
    is_employed: z.enum(['Yes', 'No']).default('No'),
    occupation: z.string().max(50).nullable().optional(),
    year_experience: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Invalid number'
      })
      .transform((val) => Number(val))
      .nullable()
      .optional(),
    monthly_income: z
      .string()
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
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Invalid number'
      })
      .transform((val) => Number(val))
      .nullable()
      .optional(),
    catchment_area: z.enum(['Yes', 'No']).default('No'),
    nre_job_card_no: z.string().max(50).nullable().optional(),
    mgnrega_hours_worked: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Invalid number'
      })
      .transform((val) => Number(val))
      .nullable()
      .optional(),
    status: z.string().max(20).default('Applied'),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
  })
  .superRefine((data, ctx) => {
    if (data.is_disabled === 'Yes' && data.disability_type === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Disability type is required if disabled is Yes',
        path: ['disability_type']
      });
      return false;
    } else {
      data.disability_type = data.disability_type || null;
    }
    return true;
  });

export type StudentRegistrationModelType = z.infer<
  typeof StudentRegistrationModel
>;
