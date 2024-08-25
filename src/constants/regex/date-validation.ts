import { isValid, format, parse } from 'date-fns';
import { z } from 'zod';
export const dateValidation = z
  .string({ required_error: 'Date of birth is required' })
  .transform((val) => {
    // Check if the input is already in 'yyyy-MM-dd' format
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return val; // Already formatted correctly
    }

    // If it's in 'dd/MM/yyyy' format, parse and transform it to 'yyyy-MM-dd'
    const parsedDate = parse(val, 'dd/MM/yyyy', new Date());

    // Validate if the parsed date is a valid date
    if (!isValid(parsedDate)) {
      throw new Error('Invalid date');
    }

    // Transform to 'yyyy-MM-dd' format
    return format(parsedDate, 'yyyy-MM-dd');
  });
