import { z } from 'zod';

export const StudentRegistrationApplyDomainModel = z.object({
  registration_id: z.string().max(36).uuid().optional(),
  domain_id: z
    .string({ required_error: 'Domain id is required' })
    .max(36)
    .uuid(),
  batch_id: z.string({ required_error: 'Batch id is required' }).max(36).uuid(),
  project_id: z
    .string({ required_error: 'Project id is required' })
    .max(36)
    .uuid()
});

export type StudentRegistrationApplyDomainModelType = z.infer<
  typeof StudentRegistrationApplyDomainModel
>;
