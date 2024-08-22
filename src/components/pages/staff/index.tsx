'use client';
import { Plus } from 'lucide-react';
import React from 'react';

import { staffColumn } from '@constants/columns';
import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';

import { useCQuery } from '@hooks/useCQuery';
import { ScrollArea } from '@components/ui/scroll-area';
import { staffQueryKey } from '@constants/query-keys';
import { useRouter } from 'next/navigation';

const StaffPage = () => {
  const router = useRouter();
  const { data, isFetched, isError, isLoading } = useCQuery({
    url: 'staff',
    queryKey: staffQueryKey
  });
  return (
    <ScrollArea>
      <div className="flex w-full flex-col space-y-4">
        <div className="flex items-start justify-between space-y-2">
          <Heading title={`Staff`} description="Manage Staff" />
          <Button
            size={'sm'}
            className="text-xs md:text-sm"
            onClick={() => router.push('/dashboard/staff/add-staff')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={staffColumn}
          isLoading={isLoading}
          data={
            isFetched && !isError && data && data.data
              ? data.data.data ?? []
              : []
          }
        />
      </div>
    </ScrollArea>
  );
};
export default StaffPage;
