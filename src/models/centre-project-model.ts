import { FieldsIsRequired } from '@constants/index';
import { z } from 'zod';

export const CentreProjectModel = z.object({
  project_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid({
      message: 'Project ID must be a valid UUID'
    }),
  centre_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid({
      message: 'Centre ID must be a valid UUID'
    }),
  domain_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid()
    .array()
});
export type CentreProjectModelType = z.infer<typeof CentreProjectModel>;
