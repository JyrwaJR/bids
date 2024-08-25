import { Button } from '@components/ui/button';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { Plus } from 'lucide-react';
import React from 'react';
import { sectorColumn } from '@constants/columns/sector-column';
import { DataTable } from '@components/ui/data-table';

export const ChangePassword = () => {
  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Sector`} description="Manage your Sector table" />
          <Button className="text-xs md:text-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Sector
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={sectorColumn} data={[]} />
      </div>
    </>
  );
};
