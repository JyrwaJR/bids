import { FieldsIsRequired } from '@constants/index';
import { z } from 'zod';

export const CenterDomainModel = z.object({
  centre_id: z.string().uuid().optional(),
  domain_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid()
    .array()
});
export type CenterDomainModelType = z.infer<typeof CenterDomainModel>;
