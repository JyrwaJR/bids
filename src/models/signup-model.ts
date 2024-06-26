import { z } from 'zod';

import {
    oneLowerCaseRegex, oneNumberRegex, oneSpecialCharacterOrSpace, oneUpperCaseRegex
} from '@src/constants/regex';

export const SignupModel = z
  .object({
    email: z
      .string({
        message: "Email is required",
      })
      .email({
        message: "Please enter a valid email address",
      })
      .trim(),
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, {
        message: "Should contain at least one uppercase letter",
      })
      .max(100)
      .regex(oneUpperCaseRegex, {
        message: "Should contain at least one uppercase letter",
      })
      .regex(oneLowerCaseRegex, {
        message: "Should contain at least one lowercase letter",
      })
      .regex(oneNumberRegex, {
        message: "Should contain at least one number",
      })
      .regex(oneSpecialCharacterOrSpace, {
        message: "Should contain at least one special character",
      }),
    confirmPassword: z
      .string({
        message: "Password is required",
      })
      .min(8, {
        message: "Should contain at least one uppercase letter",
      })
      .max(100)
      .regex(oneUpperCaseRegex, {
        message: "Should contain at least one uppercase letter",
      })
      .regex(oneLowerCaseRegex, {
        message: "Should contain at least one lowercase letter",
      })
      .regex(oneNumberRegex, {
        message: "Should contain at least one number",
      })
      .regex(oneSpecialCharacterOrSpace, {
        message: "Should contain at least one special character",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });
export type SignupModelType = z.infer<typeof SignupModel>;
