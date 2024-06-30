import * as z from 'zod';

export const RegistrationDomainAppliedRequestModel = z.object({
  registration_id: z.string().nonempty('Registration ID is required'),
  domain_id: z.array(z.string()).min(1) // Array of strings for domain IDs, at least one required
});

export type RegistrationDomainAppliedRequestModelType = z.infer<
  typeof RegistrationDomainAppliedRequestModel
>;
