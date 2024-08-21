'use client';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { ZodError, z } from 'zod';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';

import { SubmitHandler, useForm } from 'react-hook-form';
import { FormFieldType } from './type';
import { Form } from './form';
import { startStudentRegistrationFields } from '@constants/input-fields/students/student-registration-fields';
import { useCMutation } from '@hooks/useCMutation';

export type StepType = {
  id: string;
  name: string;
  fields: FormFieldType[];
};

const Model = z.object({
  first_name: z.string({
    required_error: 'First name is required'
  }),
  middle_name: z.string().optional(),
  last_name: z.string(),
  mobile: z
    .number({
      required_error: 'Mobile number is required'
    })
    .min(10)
    .max(10),
  dob: z
    .date({
      required_error: 'Date of birth is required'
    })
    .refine((val) => format(val, 'yyyy-MM-dd') !== '1970-01-01', {
      message: 'Date of birth is required'
    })
});
type Model = z.infer<typeof Model>;

export const RegistrationStepperForm = () => {
  const form = useForm<Model>({
    resolver: zodResolver(Model)
  });
  const mutate = useCMutation({
    method: 'POST',
    url: '/registration/start-registration'
  });
  const onSubmit: SubmitHandler<Model> = async (data) => {
    try {
      const res = await mutate.mutateAsync(data);
      if (res.success === true) {
        form.reset();
        showToast(SuccessToastTitle, res.message);
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        showToast('Validation Error', error.errors[0].message);
      } else if (error instanceof AxiosError) {
        showToast(
          FailedToastTitle,
          error.response?.data.message || 'An error occurred'
        );
      } else {
        showToast(
          FailedToastTitle,
          error.message || 'An unexpected error occurred'
        );
      }
    }
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <Form
        form={form}
        loading={mutate.isLoading}
        fields={startStudentRegistrationFields}
        onSubmit={onSubmit}
        className="md:col-span-6"
        btnText="Register"
      />
    </div>
  );
};
