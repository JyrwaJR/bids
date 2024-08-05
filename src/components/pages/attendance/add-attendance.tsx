import { Form } from '@components/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { attendenceFields } from '@constants/input-fields/attendance/attendance-fields';
import { attendanceQueryKey } from '@constants/query-keys';
import { FailedToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { AttendanceModel, AttendanceModelType } from '@models/attendance-model';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
type Props = {
  open: boolean;
  onClose: () => void;
};
export const AddAttendance = ({ open, onClose }: Props) => {
  const form = useForm<AttendanceModelType>({
    resolver: zodResolver(AttendanceModel)
  });
  const mutate = useCMutation({
    url: 'attendance/save',
    method: 'POST',
    queryKey: attendanceQueryKey
  });
  const onSubmit: SubmitHandler<AttendanceModelType> = async (data) => {
    try {
      await mutate.mutateAsync(data);
    } catch (err: any) {
      showToast(FailedToastTitle, err.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendance</DialogTitle>
          <DialogDescription>
            please enter the date to add an attendance
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          loading={false}
          fields={attendenceFields}
        />
      </DialogContent>
    </Dialog>
  );
};
