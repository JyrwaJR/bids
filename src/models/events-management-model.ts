import { format, parse } from 'date-fns';
import { z } from 'zod';

// Helper function to validate date format
const isValidDate = (
  val: string,
  dateFormat: string = 'yyyy-MM-dd'
): boolean => {
  try {
    const parsedDate = parse(val, dateFormat, new Date());
    return (
      format(parsedDate, dateFormat) === val && !isNaN(parsedDate.getTime())
    );
  } catch {
    return false;
  }
};

export const EventManagementModel = z.object({
  event_name: z
    .string()
    .max(250, 'Event name should be at most 250 characters long.'),

  event_date: z.string().refine((val) => isValidDate(val), {
    message: 'Invalid date format. Expected format: yyyy-MM-dd'
  }),

  extended_till: z
    .string()
    .refine((val) => isValidDate(val), {
      message: 'Invalid date format. Expected format: yyyy-MM-dd'
    })
    .optional()
    .nullable(),

  event_location: z
    .string()
    .max(200, 'Event location should be at most 200 characters long.'),

  remarks: z.string().optional(), // Assuming remarks is optional

  status: z
    .string()
    .max(12, 'Status should be at most 12 characters long.')
    .default('Active'),

  men: z.number().int('Men count should be an integer.'),

  women: z.number().int('Women count should be an integer.'),

  youth: z.number().int('Youth count should be an integer.'),

  social_organisation: z
    .number()
    .int('Social organisation count should be an integer.'),

  community_leaders: z
    .number()
    .int('Community leaders count should be an integer.'),
  id: z.string().uuid().optional(),
  total_participants: z
    .number()
    .int('Total participants count should be an integer.')
});

export type EventManagementModelType = z.infer<typeof EventManagementModel>;
