import { CForm, FormFieldType } from '@components/form';
import { Typography } from '@components/typography';
import { studentRegistrationPresentAddressFields } from '@constants/input-fields/students/student-registration-fields';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { StudentRegistrationModelType } from '@models/student';
import { UseFormReturn } from 'react-hook-form';
import { StudentPermanentAddressForm } from '..';

export const StudentPresentAddressForm = ({
  form,
  loading = false,
  className
}: {
  className?: string;
  loading?: boolean;
  form: UseFormReturn<StudentRegistrationModelType | any>;
}) => {
  const { isLoading, options } = useCategorySelectOptions();
  const updatedFields: FormFieldType[] =
    studentRegistrationPresentAddressFields.map((field) => {
      if (field.select) {
        switch (field.name) {
          case 'state':
            return { ...field, options: options.states };
          case 'district':
            return { ...field, options: options.district };
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
      <Typography size={'h2'} weight={'bold'}>
        Present
      </Typography>
      <CForm
        form={form}
        loading={loading || isLoading}
        fields={updatedFields}
        className={className}
      />
      <StudentPermanentAddressForm form={form} 
      loading={loading || isLoading}
      className={className}
      />
    </div>
  );
};
