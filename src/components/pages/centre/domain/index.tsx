import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { domainColumn } from '@constants/columns';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

export const CenterDomainPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading } = useCQuery({
    url: 'domain',
    queryKey: ['get', 'domain']
  });
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-start justify-between">
        <Heading title={`Center`} description="Manage ur center table" />
        <Button className="text-xs md:text-sm" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={domainColumn}
        data={isLoading ? [] : data.data}
      />
    </div>
  );
};
