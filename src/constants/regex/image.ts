import { z } from 'zod';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from '..';
export const imageValidation = z
  .instanceof(File, {
    message: 'Please select an image'
  })
  .refine((file) => file !== undefined && file !== null, {
    message: 'Please select an image'
  })
  .refine((file) => {
    return file && file.size <= MAX_UPLOAD_SIZE;
  }, 'File size must be less than 2MB')
  .refine((file) => {
    return file && ACCEPTED_FILE_TYPES.includes(file.type);
  }, 'File must be a PNG');
