import * as z from 'zod';

export const StudentSupportiveDocumentModel = z.object({
  id: z.string().uuid(),
  registration_id: z.string().max(30).nonempty('Registration ID is required'),
  centre_id: z.string().max(36).nonempty('Centre ID is required'),
  domain_id: z.string().max(36).nonempty('Domain ID is required'),
  project_id: z.string().max(36).nonempty('Project ID is required'),
  id_proof: z.string().max(100).nullable().optional(),
  id_proof_document: z.string().max(100).nullable().optional(),
  residence_proof: z.string().max(100).nullable().optional(),
  residence_proof_document: z.string().max(100).nullable().optional(),
  age_proof: z.string().max(100).nullable().optional(),
  age_proof_document: z.string().max(100).nullable().optional(),
  caste_proof: z.string().max(100).nullable().optional(),
  pwd_proof: z.string().max(100).nullable().optional(),
  education_proof: z.string().max(100).nullable().optional(),
  bpl_income_proof: z.string().max(100).nullable().optional(),
  exception_approval_document: z.string().max(100).nullable().optional()
  // timestamps can be handled separately if needed
  // created_at: z.date().optional(),
  // updated_at: z.date().optional(),
});

export type StudentSupportiveDocumentModelType = z.infer<
  typeof StudentSupportiveDocumentModel
>;
