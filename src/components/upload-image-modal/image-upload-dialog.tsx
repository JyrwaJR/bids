import { Form, FormFieldType } from '@components/form';
import { OptionsT } from '@components/form/type';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { useCQuery } from '@hooks/useCQuery';
import { useRegisterStudent } from '@lib/store';
import { useUploadDocStore } from '@lib/store/useUploadDocStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
const Schema = z
  .object({
    proof_type: z
      .string({
        required_error: 'Proof type is required'
      })
      .min(1, 'Proof type is required'),
    document_type: z
      .string({
        required_error: 'Document type is required'
      })
      .min(1, 'Document type is required'),
    image: z.any({
      required_error: 'File upload is required'
    }),
    document_no: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.proof_type === 'ID Proof' && !data.document_no) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Document number is required',
        path: ['document_no']
      });
    }
  });

type CategoryOptions = {
  category: string;
  options: OptionsT[];
};
export const ImageUploadDialog = ({
  filter,
  title = 'Upload Document',
  desc = 'Please upload your document'
}: {
  filter?: string;
  title?: string;
  desc?: string;
}) => {
  const { id } = useRegisterStudent();
  const { open, setOpen } = useUploadDocStore();

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema)
  });
  const { data, isLoading } = useCQuery({
    url: 'registration/get-document-types'
  });

  const mutate = useCMutation({
    url: `registration/upload-document/${id}`,
    method: 'PUT',
    queryKey: ['profile']
  });

  const transformData = (data: {
    [key: string]: string[] | undefined;
  }): CategoryOptions[] => {
    const transformedData: CategoryOptions[] = [];

    for (const category in data) {
      if (Array.isArray(data[category])) {
        const options: OptionsT[] =
          data[category]?.map((item: string) => ({
            label: item,
            value: item
          })) || [];
        transformedData.push({ category, options });
      }
    }

    return transformedData;
  };

  const proofTypeOptions: OptionsT[] = transformData(data?.data || []).map(
    (item) => ({
      label: item.category,
      value: item.category
    })
  );

  const filterSubOptions = (
    category: string,
    data?: { [key: string]: string[] | undefined }
  ) => {
    const filteredOptions = transformData(data || {}).find(
      (item) => item.category === category
    );
    return filteredOptions?.options || [];
  };
  const isFieldWithDocNo: FormFieldType[] = [
    {
      name: 'proof_type',
      label: 'Proof Category',
      type: 'select',
      select: true
    },
    {
      name: 'document_type',
      label: 'Document Type',
      select: true
    },
    {
      name: 'image',
      label: 'File Upload',
      type: 'file'
    },
    form.watch('proof_type') === 'ID Proof'
      ? {
          name: 'document_no',
          label: 'Document No',
          type: 'text'
        }
      : undefined
  ].filter(Boolean) as FormFieldType[];

  const updatedFields: FormFieldType[] = isFieldWithDocNo.map(
    (field: FormFieldType) => {
      if (field.select) {
        switch (field.name) {
          case 'proof_type':
            return {
              ...field,
              options: !!filter
                ? proofTypeOptions.filter((item) => item.value === filter)
                : proofTypeOptions
            };
          case 'document_type':
            return {
              ...field,
              options: filterSubOptions(form.watch('proof_type'), data?.data),
              readOnly: !form.watch('proof_type')
            };
          default:
            return field;
        }
      }
      return field;
    }
  );
  // want to add some more fields to update fields if needed

  const onSubmit: SubmitHandler<any> = async (formData) => {
    try {
      if (!id) {
        showToast(
          FailedToastTitle,
          'Please register first to upload documents'
        );
        return;
      }
      if (
        !filterSubOptions(form.watch('proof_type'), data?.data).some(
          data.document_type
        )
      ) {
        showToast(FailedToastTitle, 'Please select valid document type');
        return;
      }
      await mutate.mutateAsync(formData);
      setOpen(false);
      showToast('Upload Success', 'Document uploaded successfully');
    } catch (error) {
      showToast(FailedToastTitle, 'Something went wrong');
    }
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Form
          fields={updatedFields}
          form={form}
          onSubmit={onSubmit}
          loading={isLoading}
          btnStyle="md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};
