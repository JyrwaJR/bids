import { Form } from '@components/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { eventManagementFields } from '@constants/input-fields';
import { eventsManagementQueryKey } from '@constants/query-keys';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { appendNonFileDataToFormData } from '@lib/appendNoneFileDataToFileData';
import {
  EventManagementModel,
  EventManagementModelType
} from '@models/events-management-model';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
type Props = {
  open: boolean;
  onClose: () => void;
};

export const AddEventsManagement = ({ open, onClose }: Props) => {
  const form = useForm<EventManagementModelType>({
    resolver: zodResolver(EventManagementModel),
    defaultValues: {
      total_participants: 0,
      men: 0,
      women: 0
    }
  });
  const { isLoading, mutateAsync } = useCMutation({
    url: 'events/save',
    method: 'POST',
    queryKey: eventsManagementQueryKey
  });
  const onSubmit: SubmitHandler<EventManagementModelType> = async (data) => {
    try {
      // Check if image is present
      if (data.image) {
        // Create a FormData object to send all data, including the image
        const formData = new FormData();

        // Append non-file data to FormData
        appendNonFileDataToFormData(data, formData);

        // Append the image file
        formData.append('image', data.image);

        // Send the FormData object
        const response = await mutateAsync(formData);

        if (response.success) {
          showToast(SuccessToastTitle, response.message);
        } else {
          throw new Error(response.message || 'Data submission failed');
        }
      } else {
        // If no image, send the data directly as a regular object
        const res = await mutateAsync(data);

        if (res.success) {
          showToast(SuccessToastTitle, res.message);
        } else {
          throw new Error(res.message || 'Data submission failed');
        }
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message || 'An error occurred');
    } finally {
      // Reset the form and clean up
      form.reset();
      onClose();
    }
  };
  console.log(form.formState.errors);
  const men = useWatch({ control: form.control, name: 'men', defaultValue: 0 });
  const women = useWatch({
    control: form.control,
    name: 'women',
    defaultValue: 0
  });
  useEffect(() => {
    const totalParticipants = men + women;
    form.setValue('total_participants', totalParticipants, {
      shouldDirty: true
    });
  }, [men, women, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Events Management</DialogTitle>
          <DialogDescription>
            Please enter the following detail
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          loading={isLoading}
          fields={eventManagementFields}
          className="md:col-span-6"
          btnStyle="md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};
