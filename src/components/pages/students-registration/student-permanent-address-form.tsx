import { CForm, FormFieldType } from '@components/form';
import { Typography } from '@components/typography';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';
import { studentRegistrationPermanentsAddressDetailFields } from '@constants/input-fields/students/student-registration-fields';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { StudentRegistrationModelType } from '@models/student';
import { useEffect, useState } from 'react';
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
  const [isSameAsPresent, setIsSameAsPresent] = useState<boolean>(false);
  const { options, isLoading } = useCategorySelectOptions();

  // p_state p_district
  const updatedFields: FormFieldType[] =
    studentRegistrationPermanentsAddressDetailFields.map((field) => {
      if (field.select) {
        switch (field.name) {
          case 'p_state':
            return { ...field, options: options.states };
          case 'p_district':
            return { ...field, options: options.district };
          default:
            return field;
        }
      }
      return field;
    });

  useEffect(() => {
    if (isSameAsPresent) {
      form.reset({
        ...form.getValues(),
        permanent_address: form.getValues('address'),
        p_landmark: form.getValues('landmark'),
        p_village: form.getValues('village'),
        p_panchayat: form.getValues('panchayat'),
        p_block: form.getValues('block'),
        p_police_station: form.getValues('police_station'),
        p_post_office: form.getValues('post_office'),
        p_district: form.getValues('district'),
        p_state: form.getValues('state'),
        p_pin_code: form.getValues('pin_code')
      });
    }
  }, [isSameAsPresent, form]);
  return (
    <div className="space-y-4 py-5">
      <Typography size={'h2'} weight={'bold'}>
        Permanent Address
      </Typography>
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={isSameAsPresent}
          onCheckedChange={() => setIsSameAsPresent(!isSameAsPresent)}
        />
        <Label>Same as Present Address</Label>
      </div>
      <CForm
        disabled={isSameAsPresent}
        form={form}
        loading={loading || isLoading}
        fields={updatedFields}
        className={className}
      />
    </div>
  );
};
