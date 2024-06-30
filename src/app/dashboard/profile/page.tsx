'use client';
import Stepper from '@components/forms/user-profile-stepper/create-profile';
import BreadCrumb from '@src/components/breadcrumb';
import { ScrollArea } from '@src/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import {
  StudentRegistrationModel,
  StudentRegistrationModelType
} from '@src/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentRegistrationStepsFields } from '@constants/input-fields';

const breadcrumbItems = [{ title: 'Profile', link: '/dashboard/profile' }];
export default function Page() {
  const form = useForm<StudentRegistrationModelType>({
    resolver: zodResolver(StudentRegistrationModel),
    mode: 'onChange'
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Stepper
          form={form}
          onSubmit={onSubmit}
          steps={studentRegistrationStepsFields}
        />
      </div>
    </ScrollArea>
  );
}
