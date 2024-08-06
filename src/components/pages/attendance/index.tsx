import React, { useState } from 'react';
import { AddAttendance } from './add-attendance';

import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';
import { attendanceColumn } from '@constants/columns/attendance';
import { useCQuery } from '@hooks/useCQuery';
import { attendanceQueryKey } from '@constants/query-keys';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Plus } from 'lucide-react';
import { ScrollArea } from '@components/ui/scroll-area';
import { useForm } from 'react-hook-form';
export const AttendancePage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm();
  const { isFetched, data, isError, isLoading } = useCQuery({
    url: 'attendance',
    queryKey: attendanceQueryKey
  });
  return (
    <ScrollArea>
      <div className="flex-1 space-y-4">
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="new-attendance">New Attendance </TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="space-y-4">
            <div className="flex w-full flex-col space-y-4">
              <div className="flex items-start justify-between space-y-2">
                <Heading title={`Attendance`} description="Manage Attendance" />
              </div>
              <Separator />
              <DataTable
                searchKey="name"
                columns={attendanceColumn}
                isLoading={isLoading}
                data={
                  isFetched && !isError && data && data.data
                    ? data.data.data ?? []
                    : []
                }
              />
            </div>
          </TabsContent>
          <TabsContent value="new-attendance" className="space-y-4">
            <AddAttendance />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};
