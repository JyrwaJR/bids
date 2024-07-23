import format from 'date-fns/format';
import { z } from 'zod';

export const EventManagementModel = z.object({
  event_name: z
    .string()
    .max(250, 'Event name should be at most 250 characters long.'),

  event_date: z.string().refine((val) => format(new Date(val), 'yyyy-MM-dd'), {
    message: 'Invalid date'
  }),

  event_location: z
    .string()
    .max(200, 'Event location should be at most 200 characters long.'),

  remarks: z.string().optional(), // Assuming remarks is optional

  status: z.string().max(12, 'Status should be at most 12 characters long.'),

  men: z.number().int('Men count should be an integer.'),

  women: z.number().int('Women count should be an integer.'),

  youth: z.number().int('Youth count should be an integer.'),

  social_organisation: z
    .number()
    .int('Social organisation count should be an integer.'),

  community_leaders: z
    .number()
    .int('Community leaders count should be an integer.'),
  total_participants: z
    .number()
    .int('Total participants count should be an integer.')
    .optional()
});

export type EventManagementModelType = z.infer<typeof EventManagementModel>;
