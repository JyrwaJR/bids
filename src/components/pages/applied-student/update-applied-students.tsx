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
import { FailedToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const StudentStatusOptions: OptionsT[] = [
  {
    label: 'Pending',
    value: 'Waiting'
  },
  {
    label: 'Approved',
    value: 'Selected'
  },
  {
    label: 'Rejected',
    value: 'Rejected'
  }
];
type Props = {
  open: boolean;
  onClose: () => void;
  registration_id: string[];
};
const UpdateStudentSchema = z.object({
  status: z.string()
});
type UpdateStudentSchemaType = z.infer<typeof UpdateStudentSchema>;
export const UpdateAppliedStudentForm = ({
  open,
  onClose,
  registration_id
}: Props) => {
  const form = useForm<UpdateStudentSchemaType>({
    resolver: zodResolver(UpdateStudentSchema)
  });
  const [id, setId] = useState<string>('');
  const mutate = useCMutation({
    url: `registration/update-candidate-registration-status/${id}`,
    method: 'PUT',
    queryKey: ['applied-student']
  });
  const onUpdateStudent = async (data: { status: string }) => {
    try {
      if (registration_id.length > 0) {
        registration_id.forEach(async (id: string) => {
          setId(id);
          await mutate.mutateAsync({
            status: data.status
          });
          if (mutate.isSuccess) {
            setId('');
          }
        });
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
