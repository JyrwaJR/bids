'use client';
import { Form, FormFieldType } from '@components/index';
import UploadImageModal from '@components/upload-image-modal';
// import Stepper from '@components/forms/user-profile-stepper/create-profile';
// import BreadCrumb from '@src/components/breadcrumb';
import { ScrollArea } from '@src/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
// import { useForm } from 'react-hook-form';
// import {
//   StudentRegistrationModel,
//   StudentRegistrationModelType
// } from '@src/models';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { studentRegistrationStepsFields } from '@constants/input-fields';

const breadcrumbItems = [{ title: 'Profile', link: '/dashboard/profile' }];
const fields: FormFieldType[] = [
  {
    name: 'test',
    type: 'file',
    label: 'Passport Photo',
    placeholder: 'Please select passport photo'
  },
  {
    name: 'password',
    type: 'file',
    label: 'Passport Photo'
  }
];
export default function Page() {
  const form = useForm({
    // resolver: zodResolver(StudentRegistrationModel),
    mode: 'onChange'
  });

  const onSubmit = (data: any) => {
    // console.log(data);
  };
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Form form={form} fields={fields} onSubmit={onSubmit} loading={false} />
      </div>
      <UploadImageModal
        form={form}
        open={true}
        onClose={console.log}
        fields={fields}
        onSubmit={onSubmit}
        isLoading={false}
      />
    </ScrollArea>
  );
}
