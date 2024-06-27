import { SubmitHandler, UseFormReturn } from 'react-hook-form';

import { Button } from '@src/components/ui/button';
import { cn } from '@src/lib/utils';

import { Form } from '../ui/form';
import { ScrollArea } from '../ui/scroll-area';

type FormTagProps<T> = {
  form: UseFormReturn<T | any>;
  children: React.ReactNode;
  onSubmit: SubmitHandler<T | any>;
  isLoading?: boolean;
  className?: string;
  buttonTitle?: string;
  btnStyle?: string;
};

export const FormTag = <T,>({
  form,
  children,
  onSubmit,
  className,
  isLoading = false,
  buttonTitle = 'Submit',
  btnStyle
}: FormTagProps<T>) => {
  const styles = cn(
    'grid w-full grid-cols-12 gap-2 px-2 overflow-y-auto',
    className
  );
  const buttonStyle = cn('w-full md:w-auto', btnStyle);
  return (
    <Form {...form}>
      <ScrollArea>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className={styles}
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
      </ScrollArea>
    </Form>
  );
};
