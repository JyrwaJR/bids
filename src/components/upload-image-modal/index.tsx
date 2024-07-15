import { FormFieldType } from '@components/form';
import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';
import { useUploadDocStore } from '@lib/store/useUploadDocStore';
import React from 'react';
import { ImageUploadDialog } from './image-upload-dialog';
// import { useRegisterStudentStore } from '@lib/store';

// type DocToUpload = {
//   name: string;
//   desc?: string;
//   uploaded?: boolean;
//   onClick?: () => void;
// };

type Props = {
  fields: FormFieldType[];
};
const UploadImageModal = ({ fields }: Props) => {
  const {
    setOpen,
    open,
    isSelectedFilterType,
    setSelectedFilterType,
    proofOfIdUploaded,
    residentProofUploaded,
    ageProofUploaded,
    educationalProofUploaded,
    castProofUploaded,
    otherProofUploaded
  } = useUploadDocStore();

  // const formList: DocToUpload[] = [
  //   {
  //     name: 'ID Proof',
  //     desc: 'Please upload your ID proof',
  //     uploaded: proofOfIdUploaded
  //   },
  //   {
  //     name: 'Residence Proof',
  //     uploaded: residentProofUploaded
  //   },
  //   {
  //     name: 'Age Proof',
  //     uploaded: ageProofUploaded
  //   },
  //   {
  //     name: 'Education Qaulification Proof',
  //     uploaded: educationalProofUploaded
  //   },
  //   {
  //     name: 'BPL Proof'
  //   },
  //   {
  //     name: 'Proof of Caste',
  //     uploaded: castProofUploaded
  //   },
  //   {
  //     name: 'Proof of Disability',
  //     uploaded: otherProofUploaded
  //   },
  //   {
  //     name: 'Exceptional Proof',
  //     uploaded: otherProofUploaded
  //   }
  // ];
  const isUploadedImage = (name: string) => {
    switch (name) {
      case 'ID Proof':
        return proofOfIdUploaded;
      case 'Residence Proof':
        return residentProofUploaded;
      case 'Age Proof':
        return ageProofUploaded;
      case 'Education Qaulification Proof':
        return educationalProofUploaded;
      case 'Proof of Caste':
        return castProofUploaded;
      case 'Proof of Disability':
        return otherProofUploaded;
    }
  };
  return (
    <>
      <div className="grid grid-cols-12 items-center space-y-5">
        {fields.map((field, i) => (
          <div
            key={i}
            className="col-span-6 flex w-full items-center justify-center space-x-3"
          >
            <Button
              className="w-full uppercase"
              variant={'outline'}
              onClick={() => {
                setSelectedFilterType(field.name);
                setOpen(true);
              }}
            >
              {field.name}
            </Button>
            <div className="flex w-full space-x-3">
              <Checkbox disabled checked={isUploadedImage(field.name)} />
              <Label>
                {isUploadedImage(field.name) ? 'Uploaded' : 'Not Uploaded'}
              </Label>
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
