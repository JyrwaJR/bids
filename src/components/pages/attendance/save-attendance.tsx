import { Form, FormFieldType } from '@components/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { attendanceQueryKey } from '@constants/query-keys';
import { FailedToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { AttendanceModel, AttendanceModelType } from '@models/attendance-model';
import { useForm } from 'react-hook-form';
const fields: FormFieldType[] = [
  {
    name: 'date',
    label: 'Date',
    type: 'date'
  }
];
export const SaveAttendance = ({
  ids,
  open,
  onClose,
  batch_id
}: {
  ids: string[];
  onClose: () => void;
  open: boolean;
  batch_id: string;
}) => {
  const form = useForm({
    resolver: zodResolver(AttendanceModel),
    defaultValues: {
      student_id: ids,
      batch_id: batch_id
    }
  });
  const mutate = useCMutation({
    url: 'attendance/save',
    method: 'POST',
    queryKey: attendanceQueryKey
  });
  const onSubmit = async (data: AttendanceModelType) => {
    try {
      const absentStatus = Array(ids.length).fill('Absent');
      const payload = {
        ...data,
        status: absentStatus
      };
      await mutate.mutateAsync(payload);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Attendance</DialogTitle>
          <DialogDescription>Save Attendance</DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          btnStyle="md:w-full"
          fields={fields}
          loading={mutate.isLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
