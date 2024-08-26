import { Typography } from '@components/index';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@components/ui/dialog';
import { EventManagementModelType } from '@models/events-management-model';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  data: EventManagementModelType;
};

export const ViewEvents = ({ open, onClose, data }: Props) => {
  // Convert key to proper string
  const convertKeyToString = (key: string) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  // Render preview content
  const renderValue = (key: string, value: any) => {
    if (key === 'image' && value) {
      return <img src={value} alt="Event" className="w-32 h-32 object-cover" />;
    }
    if (key === 'event_date' || key === 'extended_till') {
      return formatDate(value);
    }
    return value?.toString() || 'N/A';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>View Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => 
            key !== 'event_images' ? (
              <div key={key} className="flex items-center space-x-4">
                <Typography weight="bold">{convertKeyToString(key)}:</Typography>
                <div className="flex-1">
                  {renderValue(key, value)}
                </div>
              </div>
            ) : null
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
