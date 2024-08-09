import { z } from 'zod';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from '..';
export const imageValidation = z
  .instanceof(File, {
    message: 'Please select an image'
  })
  // Corrected: Checks the file size, ensuring it is less than or equal to MAX_UPLOAD_SIZE.
  .refine((file) => file && file.size <= MAX_UPLOAD_SIZE, {
    message: 'File size must be less than 2MB'
  })
  // Corrected: Ensures the file type is one of the accepted types.
  .refine((file) => file && ACCEPTED_FILE_TYPES.includes(file.type), {
    message: 'File must be a PNG/jpg/jpeg'
  });
