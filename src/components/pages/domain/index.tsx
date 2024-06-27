import BreadCrumb from '@components/breadcrumb';
import { Button } from '@components/ui/button';

import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { AddDomain } from './add-domain';
import { DataTable } from '@components/ui/data-table';
import { domainColumn } from '@constants/columns';

export const DomainPage = () => {
  const breadcrumbItems = [{ title: 'User', link: '/dashboard/user' }];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading } = useCQuery({
    url: 'domain',
    queryKey: ['get', 'domain']
  });
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Domain`} description="Manage ur Domain table" />
          <Button
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
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
      {isOpen && <AddDomain open onClose={() => setIsOpen(false)} />}
    </>
  );
};
