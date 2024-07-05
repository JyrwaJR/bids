import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import React from 'react';
import { Button } from '@components/ui/button';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSelectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export const AddProjects = ({ onClose, open, onSubmit }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Projects</DialogTitle>
          <DialogDescription>please Please select a domain</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
