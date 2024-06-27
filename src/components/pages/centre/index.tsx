'use client';
import React, { useState } from 'react';
import { Heading } from '@src/components/ui/heading';
import { Button } from '@src/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@src/components/ui/separator';
import { DataTable } from '@src/components/ui/data-table';
import BreadCrumb from '@src/components/breadcrumb';
import { AddCentre } from './add-center';
import { CentreColumn } from '@constants/columns';

export const CentrePage = () => {
  const breadcrumbItems = [{ title: 'User', link: '/dashboard/user' }];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Center`} description="Manage ur center table" />
          <Button
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={CentreColumn} data={[]} />
      </div>
      {isOpen && <AddCentre open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
};
