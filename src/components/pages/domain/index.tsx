import { Button } from '@components/ui/button';

import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { domainColumn } from '@constants/columns';
import { AddDomain } from '@components/pages';

const DomainPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isFetched } = useCQuery({
    url: 'domain',
    queryKey: ['get', 'domain']
  });

  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <div className="flex items-start justify-between">
          <Heading title={`Domain`} description="Manage ur Domain table" />
          <Button
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Domain
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={domainColumn}
          data={isFetched && data.data}
        />
      </div>
      {isOpen && <AddDomain open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default DomainPage;
