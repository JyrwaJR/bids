import { z } from 'zod';

export const userRole = z.enum(['superadmin', 'user']);
