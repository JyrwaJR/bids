import { CForm } from '@components/form';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Form } from '@components/ui/form';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
type Props = {
  open: true | false;
  onClose: () => void;
  id: string;
};
const Model = z
  .object({
    new_password: z.string({
      required_error: 'Password is required'
    }),
    user_id: z
      .string({
        required_error: 'Password is required'
      })
      .uuid(),
    confirm_password: z.string({
      required_error: 'Confirm password is required'
    })
  })
  .superRefine(({ new_password, confirm_password }, ctx) => {
    if (new_password !== confirm_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirm_password']
      });
    }
  });

type Model = z.infer<typeof Model>;

export const ChangeUserPassword = ({ open, onClose, id }: Props) => {
  const form = useForm<Model>({
    resolver: zodResolver(Model),
    defaultValues: {
      user_id: id
    }
  });

  const mutate = useCMutation({
    method: 'POST',
    url: 'change-user-password',
    queryKey: ['change-password']
  });

  const onSubmit: SubmitHandler<Model> = async (data: Model) => {
    try {
      const res = await mutate.mutateAsync(data);
      if (res.success) {
        showToast(SuccessToastTitle, res.message);
        onClose();
      }
    } catch (e: any) {
      showToast(FailedToastTitle, e.message, 'destructive');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Please enter your new password</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CForm
              loading={false}
              form={form}
              fields={[
                {
                  name: 'new_password',
                  label: 'New Password',
                  type: 'password',
                  placeholder: 'Enter new password'
                },
                {
                  name: 'confirm_password',
                  label: 'Confirm New Password',
                  type: 'password',
                  placeholder: 'Enter confirm password'
                }
              ]}
            />
            <DialogFooter className="space-x-2">
              <Button type="button" variant={'secondary'} onClick={onClose}>
                Close
              </Button>
              <Button type="submit" disabled={mutate.isLoading}>
                Change
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
