import z from 'zod';

export const LoginModel = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email({
      message: 'Please enter a valid email address'
    })
    .trim(),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(6)
    .max(100)
});

export type LoginModelType = z.infer<typeof LoginModel>;
