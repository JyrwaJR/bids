import { CForm, FormFieldType } from '@components/form';
import { Typography } from '@components/typography';
import { StudentRegistrationModelType } from '@models/student';
import { useForm, UseFormReturn } from 'react-hook-form';
import { studentRegistrationDomain } from '../../../constants/input-fields/students/student-registration-fields';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCQuery } from '@hooks/useCQuery';
import React, { useEffect } from 'react';
import { categoryOptions } from '../../../constants/options/index';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import { useAuthContext } from '@context/auth';
import { OptionsT } from '@components/form/type';

async function getBatch(token: string, centreId: string, projectId?: string) {
  try {
    console.log(projectId);
    if (!projectId) return;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/batch/get-batch-by-centre/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}
export const StudentApplyDomainForm = ({
  form,
  loading = false,
  className
}: {
  batchOptions?: OptionsT[];
  className?: string;
  loading?: boolean;
  form: UseFormReturn<StudentRegistrationModelType | any>;
}) => {
  const { options, isLoading: Optloading } = useCategorySelectOptions({});
  const [projectId, setProjectId] = React.useState<string | undefined>();
  const { token } = useAuthContext();
  const { data, isLoading, isFetched, isError, refetch } = useQuery({
    queryFn: async () =>
      await getBatch(token, form.watch('centre_id'), form.watch('project_id')),
    enabled: !!form.watch('project_id'),
    queryKey: form.watch('project_id')
  });
  console.log(data, !!projectId);
  const batchOptions: OptionsT[] | undefined =
    isFetched &&
    !isLoading &&
    !isError &&
    data.data.map((item: any) => ({
      label: item.batch_code,
      value: item.id
    }));
  const updatedFields: FormFieldType[] = studentRegistrationDomain.map(
    (field) => {
      if (field.select) {
        switch (field.name) {
          case 'centre_id':
            return { ...field, options: options.centre };
          case 'project_id':
            return { ...field, options: options.projects };
          case 'domain_id':
            return { ...field, options: options.domain };
          case 'batch_id':
            return {
              ...field,
              options:
                isFetched && data.data.length > 0
                  ? batchOptions
                  : [
                      {
                        label: 'No Batch',
                        value: ''
                      }
                    ]
            };
          default:
            return field;
        }
      }
      return field;
    }
  );

  useEffect(() => {
    if (form.watch('project_id') && projectId !== form.watch('project_id')) {
      setProjectId(form.watch('project_id'));
    }
  }, [form, refetch, projectId]);
  return (
    <div className="py-5">
      <Typography size={'h2'} weight={'bold'}>
        Apply Domain
      </Typography>
      <CForm
        form={form}
        loading={loading || Optloading}
        fields={updatedFields}
        className={className}
      />
    </div>
  );
};
