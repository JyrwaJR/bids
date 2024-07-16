import { Form } from '@components/form';
import { OptionsT } from '@components/form/type';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { useAppliedStudentsStore } from '@lib/store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const StudentStatusOptions: OptionsT[] = [
  {
    label: 'Waiting',
    value: 'Waiting'
  },
  {
    label: 'Selected',
    value: 'Selected'
  },
  {
    label: 'Rejected',
    value: 'Rejected'
  }
];
const UpdateStudentSchema = z.object({
  status: z
    .string()
    .refine((value) => StudentStatusOptions.some((o) => o.value === value), {
      message: 'Please select a status'
    })
});
type UpdateStudentSchemaType = z.infer<typeof UpdateStudentSchema>;
export const UpdateAppliedStudentForm = () => {
  const {
    openUpdate: open,
    setOpenUpdate,
    id,
    setId
  } = useAppliedStudentsStore();
  const form = useForm<UpdateStudentSchemaType>({
    resolver: zodResolver(UpdateStudentSchema)
  });
  const url: string = `registration/update-candidate-registration-status/${id}`;
  const mutate = useCMutation({
    url: url,
    method: 'PUT',
    queryKey: ['update status']
  });

  const onClose = () => {
    setId('');
    setId('');
    setOpenUpdate(false);
  };

  const onUpdateStudent: SubmitHandler<UpdateStudentSchemaType> = async (
    data
  ) => {
    try {
      if (!id) {
        showToast(FailedToastTitle, 'Please select a student');
        return;
      }
      await mutate.mutateAsync({ status: data.status });
      if (mutate.isSuccess) {
        showToast(
          mutate.data.success ? SuccessToastTitle : FailedToastTitle,
          mutate.data.message ?? 'Something went wrong'
        );
        onClose();
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
          <DialogDescription>Update Student status</DialogDescription>
        </DialogHeader>
        <div>
          <Form
            form={form}
            fields={[
              {
                name: 'status',
                label: 'Status',
                select: true,
                options: StudentStatusOptions
              }
            ]}
            loading={mutate.isLoading}
            onSubmit={onUpdateStudent}
            btnText="Update"
            btnStyle="md:w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
