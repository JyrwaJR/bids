import { FieldsIsRequired } from '@constants/index';
import { z } from 'zod';

export const RegistrationUploadDocumentModel = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
          'image/svg+xml'
        ].includes(file.type),
      {
        message:
          'Invalid image type. Allowed types are jpeg, png, jpg, gif, svg.'
      }
    )
    .refine((file) => file.size <= 2048 * 1024, {
      message: 'Image size must be less than or equal to 2048KB'
    })
    .optional(),
  document_type: z
    .string({
      required_error: FieldsIsRequired
    })
    .max(50, 'Document type must be at most 50 characters'),
  registration_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .max(36, 'Registration ID must be at most 36 characters')
    .optional()
});
export type RegistrationUploadDocumentModelType = z.infer<
  typeof RegistrationUploadDocumentModel
>;
