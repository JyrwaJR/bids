import * as z from 'zod';

export const CentreDomainAppliedModel = z.object({
  id: z.string().uuid(), // UUID for the primary key
  registration_id: z.string().max(36),
  domain_id: z.string().max(36),
  centre_id: z.string().max(36),
  status: z.string().max(20).default('Applied'), // Assuming 'status' is a string with max length 20
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});

export type CentreDomainAppliedModelType = z.infer<
  typeof CentreDomainAppliedModel
>;
