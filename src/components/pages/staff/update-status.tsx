import { Form } from '@components/index';
import { Dialog, DialogContent, DialogHeader } from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { useCMutation } from '@hooks/useCMutation';
import { DialogTitle } from '@radix-ui/react-dialog';
import React from 'react';
import { useForm } from 'react-hook-form';
type props = {
  open: boolean;
  onClose: () => void;
  id: string;
};

export const UpdateStaffStatus = ({ open, onClose, id }: props) => {
  const form = useForm();
  const mutate = useCMutation({
    url: `update-user-status/${id}`,
    method: 'POST'
  });
  const onSubmit = (data: any) => {
    try {
      mutate.mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message, 'destructive');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          loading={false}
          fields={[
            {
              name: 'status',
              label: 'Status',
              select: true,
              options: [
                {
                  label: 'Active',
                  value: 'active'
                },
                {
                  label: 'Inactive',
                  value: 'inactive'
                }
              ]
            }
          ]}
          btnStyle="md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};
