'use client';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { staffColumn } from '@constants/columns';
import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { ScrollArea } from '@components/ui/scroll-area';
import { ColumnDef } from '@tanstack/react-table';


export const EventsManagementPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isFetched, isError, isLoading } = useCQuery({
    url: 'events',
    queryKey: ['get', 'staff', 'category']
  });
  // TODO: add columns ,search even by center and filter by name,show centre only for one specific center when login with none super admin 
  return (
    <ScrollArea>
      <div className="flex w-full flex-col space-y-4 px-2">
        <div className="flex items-start justify-between space-y-2">
          <Heading title={`Event`} description="Manage Event" />
          <Button
            size={'sm'}
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={[]}
          isLoading={isLoading}
          data={isFetched && !isError ? data.data.data : []}
        />
      </div>
    </ScrollArea>
  );
};
