import { SubmitHandler, UseFormReturn } from 'react-hook-form';

import { Button } from '@src/components/ui/button';
import { cn } from '@src/lib/utils';

import { Form } from '../ui/form';

type FormTagProps<T> = {
  form: UseFormReturn<T | any>;
  children: React.ReactNode;
  onSubmit: SubmitHandler<T | any>;
  isLoading?: boolean;
  buttonTitle?: string;
  btnStyle?: string;
};

export const FormTag = <T,>({
  form,
  children,
  onSubmit,
  isLoading = false,
  buttonTitle = 'Submit',
  btnStyle
}: FormTagProps<T>) => {
  const buttonStyle = cn('w-full md:w-auto', btnStyle);
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-screen"
      >
        {children}
        <div className="col-span-full flex overflow-auto md:justify-end">
          <Button
            disabled={!form.formState.isDirty || isLoading}
            type="submit"
            className={buttonStyle}
          >
            {isLoading ? 'Loading' : buttonTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};
