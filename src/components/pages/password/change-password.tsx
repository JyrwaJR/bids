import { CForm, FormFieldType } from '@components/form';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@components/ui/form';
import { Input } from '@components/ui/input';
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
};
const Model = z
  .object({
    old_password: z.string({
      required_error: 'Password is required'
    }),
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

export const ChangePassword = ({ open, onClose }: Props) => {
  const form = useForm<Model>({
    resolver: zodResolver(Model)
  });

  const mutate = useCMutation({
    method: 'POST',
    url: 'change-password',
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
  const fields: FormFieldType[] = [
    {
      name: 'old_password',
      label: 'Old Password',
      type: 'password',
      placeholder: 'Enter old password'
    },
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
  ];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Please enter your new password</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {fields.map((fields, i) => (
              <FormField
                key={i}
                control={form.control}
                name={fields.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fields.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${fields.label}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
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
