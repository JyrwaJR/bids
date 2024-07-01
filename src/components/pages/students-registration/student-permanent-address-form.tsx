import { CForm, FormFieldType } from '@components/form';
import { Typography } from '@components/typography';
import { studentRegistrationPermanentsAddressDetailFields } from '@constants/input-fields/students/student-registration-fields';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { StudentRegistrationModelType } from '@models/student';
import { UseFormReturn } from 'react-hook-form';

export const StudentPermanentAddressForm = ({
  form,
  loading = false,
  className
}: {
  className?: string;
  loading?: boolean;
  form: UseFormReturn<StudentRegistrationModelType | any>;
}) => {
  const { options, isLoading } = useCategorySelectOptions();
  // p_state p_district
  const updatedFields: FormFieldType[] =
    studentRegistrationPermanentsAddressDetailFields.map((field) => {
      if (field.select) {
        switch (field.name) {
          case 'p_state':
            return { ...field, options: options.maritalStatus };
          case 'p_district':
            return { ...field, options: options.district };
          default:
            return field;
        }
      }
      return field;
    });
  return (
    <div className="py-5">
      <Typography size={'h2'} weight={'bold'}>
        Permanent Address
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
