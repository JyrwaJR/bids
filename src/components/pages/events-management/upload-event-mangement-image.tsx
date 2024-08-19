import { Form } from '@components/index';
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
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from '@constants/index';
import { eventsManagementQueryKey } from '@constants/query-keys';

type Props = {
  open: boolean;
  id: string;
  onClose: () => void;
};
const ImageModel = z.object({
  image: z
    .instanceof(File, {
      message: 'Please select an image'
    })
    .refine((file) => file !== undefined && file !== null, {
      message: 'Please select an image'
    })
    .refine((file) => {
      return file && file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 2MB')
    .refine((file) => {
      return file && ACCEPTED_FILE_TYPES.includes(file.type);
    }, 'File must be a PNG/jpg/jpeg'),
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .optional()
});
type ImageModelType = z.infer<typeof ImageModel>;
export const UploadEventsMangementImage = ({ open, id, onClose }: Props) => {
  const form = useForm<ImageModelType>({
    resolver: zodResolver(ImageModel)
  });
  useEffect(() => {
    if (!id) onClose();
  }, [id, onClose]);
  const mutate = useCMutation({
    url: `events/upload-image/${id}`,
    method: 'POST',
    queryKey: eventsManagementQueryKey
  });
  const onSubmit: SubmitHandler<ImageModelType> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('image', data.image);
      const response = await mutate.mutateAsync(formData);
      if (response.success === true) {
        form.reset();
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
          <DialogTitle className="uppercase tracking-wide">
            Upload Image
          </DialogTitle>
          <DialogDescription>
            Please enter the following detail
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          loading={mutate.isLoading}
          btnStyle="md:w-full"
          fields={[
            {
              name: 'image',
              label: 'Image',
              type: 'file',
              helperText: 'Accepted file types: PNG, JPG, JPEG'
            },
            {
              name: 'title',
              label: 'Description'
            }
          ]}
        />
      </DialogContent>
    </Dialog>
  );
};
