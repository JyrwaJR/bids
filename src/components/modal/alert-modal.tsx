'use client';
import { useEffect, useState } from 'react';

import { Button } from '@src/components/ui/button';
import { Modal } from '@src/components/ui/modal';
import { cn } from '@lib/utils';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  desc?: string;
  className?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = 'Are you sure?',
  desc = 'This action cannot be undone.',
  className
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal title={title} description={desc} isOpen={isOpen} onClose={onClose}>
      <div
        className={cn(
          'flex w-full max-w-[80%vh] items-center justify-end space-x-2 pt-6',
          className
        )}
      >
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
