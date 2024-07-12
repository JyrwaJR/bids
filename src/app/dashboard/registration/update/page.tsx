'use client';
import { Form, FormFieldType } from '@components/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Label } from '@components/ui/label';
import { FieldsIsRequired } from '@constants/index';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRegistrationFields } from '../_lib/useRegistrationFields';
import {
  StudentRegistrationModelWithDomain,
  StudentRegistrationModelWithDomainType
} from '../_lib/function';
import { MultiStepForm } from '@components/form';
import { useRegisterStudentStore } from '@lib/store/useStudentRegistration';

const findStudentField: FormFieldType[] = [
  {
    name: 'registration_id',
    label: 'Registration Id.'
  }
];
const FindStudentModel = z.object({
  registration_id: z
    .string({
      required_error: FieldsIsRequired
    })
    .uuid()
    .trim()
});
type FindStudentModelType = z.infer<typeof FindStudentModel>;
const Page = () => {
  const { id, setId } = useRegisterStudentStore();
  const updateForm = useForm<StudentRegistrationModelWithDomainType>({
    resolver: zodResolver(StudentRegistrationModelWithDomain)
  });
  const { field } = useRegistrationFields({
    form: updateForm
  });
  const form = useForm({
    resolver: zodResolver(FindStudentModel),
    defaultValues: {
      registration_id: id
    }
  });
  // TODO find student by registration id
  const onSubmit: SubmitHandler<FindStudentModelType> = (data) => {
    setId(data.registration_id);
  };

  return (
    <div>
      <MultiStepForm
        onClick={() => {}}
        checked
        form={updateForm}
        onSubmit={onSubmit}
        steps={field}
        disabled={!id}
      />
      <Dialog modal={false} open={!id}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Registration</DialogTitle>
            <DialogDescription>
              Please enter your registration Id
            </DialogDescription>
          </DialogHeader>

          <Form
            form={form}
            onSubmit={onSubmit}
            loading={false}
            fields={findStudentField}
          />
          <div className="flex flex-col items-center space-y-5">
            <Label>or</Label>
            <Label>
              Not yet register{' '}
              <span>
                <Link href={'/dashboard/registration'}>try now?</Link>
              </span>
            </Label>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
