import React from 'react';
import { AddAttendance } from './add-attendance';
import { ScrollArea } from '@components/ui/scroll-area';
export const AttendancePage = () => {
  return (
    <ScrollArea>
      <div className="flex-1 space-y-4">
        <AddAttendance />
      </div>
    </ScrollArea>
  );
};
