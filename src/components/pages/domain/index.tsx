import { Button } from '@components/ui/button';

import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { domainColumn } from '@constants/columns';
import { AddDomain } from '@components/pages';
import { OptionsT } from '@components/form/type';
import { domainQueryKey } from '@constants/query-keys';

const searchDomainBy: OptionsT[] = [
  {
    label: 'Sector',
    value: 'sector'
  },
  {
    label: 'Name',
    value: 'name'
  },
  {
    label: 'status',
    value: 'status'
  }
];
const DomainPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data, isFetched, isLoading, isError } = useCQuery({
    url: 'domain',
    queryKey: domainQueryKey
  });

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Domain`} description="Manage ur Domain table" />
          <Button
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Domain
          </Button>
        </div>
        <Separator />
        <DataTable
          searchOptions={searchDomainBy}
          searchKey="name"
          columns={domainColumn}
          data={
            isFetched && !isLoading && !isError && data.data ? data.data : []
          }
        />
      </div>
      {isOpen && <AddDomain open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default DomainPage;
