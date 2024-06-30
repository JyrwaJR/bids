import * as z from 'zod';

export const StudentModel = z.object({
  id: z.number().positive().int().optional(), // Auto-increment ID is usually optional
  created_at: z.date().optional(), // These fields are usually handled by the database, so optional
  updated_at: z.date().optional()
});
export type StudentModelType = z.infer<typeof StudentModel>;
