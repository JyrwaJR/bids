import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Form } from '@src/components';
import { projectsFields } from '@constants/input-fields/projects/project-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ProjectModel, ProjectModelType } from '@src/models';
import { useCMutation } from '@hooks/useCMutation';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';

type Props = {
  open: boolean;
  onClose: () => void;
  domainId: string[];
};

export const AddProjects = ({ onClose, open, domainId }: Props) => {
  const form = useForm<ProjectModelType>({
    resolver: zodResolver(ProjectModel),
    defaultValues: {
      domain_id: domainId
    }
  });

  const { isLoading, mutateAsync } = useCMutation({
    method: 'POST',
    url: 'project/save',
    queryKey: ['get', 'project']
  });
  const onSubmit: SubmitHandler<ProjectModelType> = async (data) => {
    try {
      if (domainId.length > 0) {
        await mutateAsync(data);
        return;
      }
      showToast(FailedToastTitle, 'Please select domain to add projects');
      onClose();
      return;
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
      onClose();
      return;
    }
  };

  console.log(form.formState.errors);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Projects</DialogTitle>
          <DialogDescription>
            please fill the following fields
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          fields={projectsFields}
          loading={isLoading}
          className="md:col-span-6"
        />
      </DialogContent>
    </Dialog>
  );
};
