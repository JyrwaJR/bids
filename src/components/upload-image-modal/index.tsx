import { FormFieldType } from '@components/form';
import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';
import { useUploadDocStore } from '@lib/store/useUploadDocStore';
import React from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { ImageUploadDialog } from './image-upload-dialog';

type DocToUpload = {
  name: string;
  desc?: string;
  uploaded?: boolean;
  onClick?: () => void;
};

const UploadImageModal = ({}: {
  fields: FormFieldType[];
  form: UseFormReturn<any>;
  onSubmit: SubmitHandler<any>;
  isLoading?: boolean;
  open: boolean;
  onClose: () => void;
}) => {
  const {
    setOpen,
    open,
    isSelectedFilterType,
    proofOfIdUploaded,
    setSelectedFilterType
  } = useUploadDocStore();
  const formList: DocToUpload[] = [
    {
      name: 'ID Proof',
      desc: 'Please upload your ID proof',
      uploaded: proofOfIdUploaded
    },
    {
      name: 'Address Proof'
    },
    {
      name: 'Age Proof'
    },
    {
      name: 'Other Proof'
    }
  ];

  return (
    <>
      <div className="flex max-w-lg flex-col items-start space-y-5">
        {formList.map((doc, i) => (
          <div key={i} className="flex w-full items-center space-x-3">
            <Button
              className="w-full uppercase"
              variant={'outline'}
              onClick={() => {
                setSelectedFilterType(doc.name);
                setOpen(true);
              }}
            >
              {doc.name}
            </Button>
            <div className="flex w-full space-x-3">
              <Checkbox disabled checked={doc.uploaded} />
              <Label>{doc.uploaded ? 'Uploaded' : 'Not Uploaded'}</Label>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <ImageUploadDialog
          title={isSelectedFilterType}
          filter={isSelectedFilterType}
        />
      )}
    </>
  );
};

export default UploadImageModal;
