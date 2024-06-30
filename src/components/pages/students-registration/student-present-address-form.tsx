import { CForm } from '@components/form';
import { Typography } from '@components/typography';
import { studentRegistrationPresentAddressFields } from '@constants/input-fields/students/student-registration-fields';
import { StudentRegistrationModelType } from '@models/student';
import { UseFormReturn } from 'react-hook-form';

export const StudentPresentAddressForm = ({
  form,
  loading = false,
  className
}: {
  className?: string;
  loading?: boolean;
  form: UseFormReturn<StudentRegistrationModelType | any>;
}) => {
  return (
    <div className="py-5">
      <Typography size={'h2'} weight={'bold'}>
        Present Address
      </Typography>
      <CForm
        form={form}
        loading={loading}
        fields={studentRegistrationPresentAddressFields}
        className={className}
      />
    </div>
  );
};
