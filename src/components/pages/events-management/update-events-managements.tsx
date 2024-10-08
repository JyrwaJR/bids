import { Form } from '@components/index';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { eventManagementFields } from '@constants/input-fields';
import { eventsManagementQueryKey } from '@constants/query-keys';
import { FailedToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import {
  EventManagementModel,
  EventManagementModelType
} from '@models/events-management-model';
import React, { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';

type Props = {
  open: boolean;
  onClose: () => void;
  data: EventManagementModelType;
};
export const UpdateEventsManagement = ({ open, onClose, data }: Props) => {
  const form = useForm({
    resolver: zodResolver(EventManagementModel),
    defaultValues: data
  });
  const watchMen = useWatch({
    control: form.control,
    name: 'men'
  });
  const watchWomen = useWatch({
    control: form.control,
    name: 'women'
  });
  const { mutateAsync, isLoading } = useCMutation({
    url: `events/update/${data.id}`,
    method: 'PUT',
    queryKey: eventsManagementQueryKey
  });
  const onSubmit: SubmitHandler<EventManagementModelType> = async (data) => {
    try {
      const response = await mutateAsync(data);
      if (response.success === true) {
        form.reset();
        onClose();
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  const onChangeMenAndWomen = useCallback(() => {
    if (watchMen || watchWomen) {
      form.setValue('total_participants', watchMen + watchWomen);
    }
  }, [watchMen, watchWomen, form]);
  useEffect(() => {
    onChangeMenAndWomen();
  }, [onChangeMenAndWomen]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Events Management</DialogTitle>
          <DialogDescription>
            Please enter the following detail
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          loading={isLoading}
          fields={[
            ...eventManagementFields,
            {
              name: 'extended_till',
              label: 'Extended Till',
              type: 'date'
            }
          ]}
          className="md:col-span-6"
          btnStyle="md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};
