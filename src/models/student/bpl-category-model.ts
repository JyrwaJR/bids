import * as z from 'zod';

export const BplCategoryModel = z.object({
  id: z.string().uuid(), // UUID for the primary key
  registration_id: z.string().max(30).nonempty('Registration ID is required'),
  bpl_card_no: z.string().max(50).nullable().optional(),
  bpl_card_issue: z.number().int().nullable().optional(),
  is_bpl_certified: z.enum(['Yes', 'No']).default('No'),
  bpl_certification_authority: z.string().max(100).nullable().optional(),
  bpl_other_certifying_authority: z.string().max(100).nullable().optional(),
  bpl_certificate_issue_date: z.date().nullable().optional(),
  // timestamps can be handled separately if needed
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
export type BplCategoryModelType = z.infer<typeof BplCategoryModel>;
