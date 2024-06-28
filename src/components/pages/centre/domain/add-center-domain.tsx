import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  domain_id: string[] | string;
};
const AddCentreDomain = ({ onClose, open }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Center Domain</DialogTitle>

          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam totam
            magnam pariatur maxime, autem quibusdam!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddCentreDomain;
