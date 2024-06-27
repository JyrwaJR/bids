import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from '@components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const AddDomain = ({ onClose, open }: Props) => {
  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Domain</DialogTitle>
          <DialogDescription>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.{' '}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
