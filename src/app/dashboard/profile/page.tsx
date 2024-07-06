'use client';
import { Form } from '@components/form';
import { FormFieldType } from '@components/index';
import { Button } from '@components/ui/button';
import UploadImageModal from '@components/upload-image-modal';
import { useCMutation } from '@hooks/useCMutation';
import { ScrollArea } from '@src/components/ui/scroll-area';
import { SubmitHandler, useForm } from 'react-hook-form';

const formFields: FormFieldType[] = [
  {
    name: 'passport',
    label: 'Passport',
    placeholder: 'John Doe',
    type: 'file'
  }
];
type FormData = {
  first_name: string;
  last_name: string;
  dob: string;
  registration_date: string;
  gender: string;
  category: string;
  mobile: string;
  religion: string;
  marital_status: string;
  education: string;
  passport: File;
};
export default function Page() {
  const form = useForm<FormData>();
  const { mutateAsync } = useCMutation({
    url: 'registration/add-personal-details/9c6da18e-33af-4b68-a55d-03aa220dc01e',
    method: 'PUT',
    queryKey: ['profile']
  });
  const onSubmit: SubmitHandler<FormData> = async (datas) => {
    console.log(datas.passport);
    const data = {
      first_name: 'John',
      last_name: 'Doe',
      dob: '1990-01-01',
      registration_date: '2024-07-06',
      gender: 'Male',
      category: 'General',
      mobile: '1234567890',
      religion: 'Christianity',
      marital_status: 'Single',
      education: "Bachelor's Degree",
      passport: datas.passport
    };
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('dob', data.dob);
    formData.append('registration_date', data.registration_date);
    formData.append('gender', data.gender);
    formData.append('category', data.category);
    formData.append('mobile', data.mobile);
    formData.append('religion', data.religion);
    formData.append('marital_status', data.marital_status);
    formData.append('education', data.education);
    formData.append('passport', data.passport);

    const response = await mutateAsync(formData);

    console.log(response);
  };
  return (
    <ScrollArea className="h-full">
      <UploadImageModal
        fields={formFields}
        form={form}
        onSubmit={onSubmit}
        isLoading={false}
        open={false}
        onClose={() => {}}
      />
    </ScrollArea>
  );
}
