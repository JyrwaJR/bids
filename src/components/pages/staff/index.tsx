'use client';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

import { ProjectColumn, staffColumn } from '@constants/columns';
import BreadCrumb from '@src/components/breadcrumb';
import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';

import { AddStaff } from './add-staff';
import { useCQuery } from '@hooks/useCQuery';
import { ScrollArea } from '@components/ui/scroll-area';

const StaffPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isFetched, isError, isLoading } = useCQuery({
    url: 'staff',
    queryKey: ['get', 'staff']
  });

  return (
    <ScrollArea>
      <div className="flex flex-col max-w-full p-4 pt-6 space-y-4 md:p-8">
        <div className="flex items-start justify-between space-y-2">
          <Heading title={`Staff`} description="Manage ur Staff" />
          <Button
            size={'sm'}
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={staffColumn}
          isLoading={isLoading}
          data={isFetched && !isError ? data.data.data : []}
        />
      </div>
      {isOpen && <AddStaff open={isOpen} onClose={() => setIsOpen(false)} />}
    </ScrollArea>
  );
};
export default StaffPage;
