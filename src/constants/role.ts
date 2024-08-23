import { z } from 'zod';

export const userRole = z.enum([
  'superadmin',
  'user',
  'coordinator',
  'mobilizer',
  'accountant',
  'trainer',
  'coordinator',
  'director',
  'event manager'
]);
