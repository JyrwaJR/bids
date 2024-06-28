import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { CentreColumn } from '@constants/columns';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { AddCentre } from './add-center';
import { useAuthContext } from '@context/auth';

export const CenterPageComponents = () => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isFetched, isLoading } = useCQuery({
    url: 'centre',
    queryKey: ['get', 'centre']
  });

  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <div className="flex items-start justify-between">
          <Heading title={`Center`} description="Manage ur center table" />
          <Button
            disabled={!isFetched || !user?.role || user?.role !== 'superadmin'}
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          isLoading={isLoading}
          columns={CentreColumn}
          data={isFetched ? data.data : []}
        />
      </div>
      {isOpen && <AddCentre open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
};
