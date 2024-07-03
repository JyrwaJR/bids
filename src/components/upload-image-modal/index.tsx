import { Form, FormFieldType } from '@components/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import React from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';

const UploadImageModal = ({
  form,
  fields,
  isLoading,
  onSubmit,
  open,
  onClose
}: {
  fields: FormFieldType[];
  form: UseFormReturn<any>;
  onSubmit: SubmitHandler<any>;
  isLoading?: boolean;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>Please select your document image to upload</DialogDescription>
        </DialogHeader>
        <Form
          fields={fields}
          form={form}
          onSubmit={onSubmit}
          loading={isLoading || false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageModal;
