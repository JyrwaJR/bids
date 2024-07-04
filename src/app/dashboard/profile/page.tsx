'use client';
import { Form, FormFieldType } from '@components/index';
import { Button } from '@components/ui/button';
import UploadImageModal from '@components/upload-image-modal';
import { ScrollArea } from '@src/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { create } from 'zustand';

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8"></div>
    </ScrollArea>
  );
}
