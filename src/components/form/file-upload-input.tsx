import { Icons } from '@components/icons';
import { Button } from '@components/ui/button';
import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@components/ui/form';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { useFileUpload } from '@hooks/useFileUpload';
import { cn } from '@src/lib/utils';
import React from 'react';
type Props = {
  label: string;
  helperText?: string;
  required?: boolean;
  name?: string;
  className?: string;
  onClickUpload?: (file: File) => void;
};
export const FileUploadInput = ({
  label,
  helperText,
  required,
  name,
  onClickUpload,
  className
}: Props) => {
  const { handleFileChange, file } = useFileUpload();
  const onClickFileUpload = () => {
    try {
      if (onClickUpload && file && file?.length > 0) onClickUpload(file);
    } catch (error) {
      showToast(FailedToastTitle, 'Something went wrong');
    }
  };
  return (
    <React.Fragment>
      <FormItem className="w-full">
        <FormLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
        <div className="flex items-center space-x-5">
          <input
            type="file"
            accept="image/*"
            className={cn(
              'block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-2 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:file:bg-neutral-700 dark:file:text-neutral-400',
              className
            )}
            name={name ?? label.toLowerCase()}
            onChange={handleFileChange}
            required={required}
          />
          <Button
            size={'icon'}
            type="button"
            onClick={onClickFileUpload}
            disabled={file ? false : true}
            variant={'default'}
          >
            <Icons.upload />
          </Button>
        </div>

        <FormDescription>{helperText}</FormDescription>
        <FormMessage />
      </FormItem>
    </React.Fragment>
  );
};
