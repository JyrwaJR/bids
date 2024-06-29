import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { BatchColumn } from '@constants/columns/batch-column';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { AddBatch } from './add-batch';
import { useAuthContext } from '@context/auth';
import { useCQuery } from '@hooks/useCQuery';
import { isError } from 'react-query';

const BatchPage = () => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isFetched, isLoading } = useCQuery({
    url: 'batch',
    queryKey: ['get', 'batch']
  });

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-start justify-between">
          <Heading title={`Center`} description="Manage ur center table" />
          <Button
            disabled={!isFetched || !user?.role || user?.role !== 'superadmin'}
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          isLoading={isLoading}
          columns={BatchColumn}
          data={isFetched && !isError ? data.data : []}
        />
      </div>
      {isOpen && <AddBatch open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default BatchPage;
