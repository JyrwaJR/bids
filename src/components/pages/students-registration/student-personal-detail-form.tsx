import { CForm, FormFieldType } from '@components/form';
import { Typography } from '@components/typography';
import { studentRegistrationPersonalDetailsFields } from '@constants/input-fields/students/student-registration-fields';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { StudentRegistrationModelType } from '@models/student';
import { useRegisterStudent } from '@src/app/dashboard/profile/page';
import { UseFormReturn } from 'react-hook-form';
type Props = {
  className?: string;
  loading?: boolean;
  form: UseFormReturn<StudentRegistrationModelType | any>;
};
export const StudentPersonalDetailsForm = ({
  form,
  loading,
  className
}: Props) => {
  const { options, isLoading } = useCategorySelectOptions();
  const updatedFields: FormFieldType[] =
    studentRegistrationPersonalDetailsFields.map((field) => {
      if (field.select) {
        switch (field.name) {
          case 'category':
            return { ...field, options: options.categories };
          case 'religion':
            return { ...field, options: options.religions };
          case 'marital_status':
            return { ...field, options: options.maritalStatus };
          case 'education':
            return { ...field, options: options.qualifications };
          default:
            return field;
        }
      }
      return field;
    });
  return (
    <div className="py-5">
      <Typography size={'h2'} weight={'medium'}>
        Personal Details
      </Typography>
      <Typography variant={'p'}>
        Please provide your personal details
      </Typography>
      <CForm
        form={form}
        loading={loading || isLoading}
        fields={updatedFields}
        className={className}
      />
    </div>
  );
};
