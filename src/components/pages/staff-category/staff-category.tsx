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
import AddStaffCategory from './add-staff-category';
import { staffCategoryQueryKey } from '@constants/query-keys';

const categoryColumn: ColumnDef<{ name: string }>[] = [
  {
    id: 'id',
    header: 'S.No',
    cell: (info) => {
      return info.row.index + 1;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
]

export const StaffCategory = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isFetched, isError, isLoading } = useCQuery({
    url: 'staffcategory',
    queryKey: staffCategoryQueryKey
  });

  return (
    <ScrollArea>
      <div className="flex w-full flex-col space-y-4 px-2">
        <div className="flex items-start justify-between space-y-2">
          <Heading title={`Staff Category`} description="Manage Category" />
          <Button
            size={'sm'}
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={categoryColumn}
          isLoading={isLoading}
          data={isFetched && !isError ? data.data.data : []}
        />
      </div>
      {isOpen && <AddStaffCategory open={isOpen} onClose={() => setIsOpen(false)} />}
    </ScrollArea>
  );
};
