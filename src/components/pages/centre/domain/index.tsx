import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { showToast } from '@components/ui/show-toast';
import { domainColumn } from '@constants/columns';
import { useCQuery } from '@hooks/useCQuery';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { AddCentreDomain } from '@components/pages/centre/domain/add-center-domain';
import { DomainModelType } from '@src/models';
interface ColumnType extends DomainModelType {
  id: string;
}
const CenterDomainPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading } = useCQuery({
    url: 'domain',
    queryKey: ['get', 'domain']
  });
  const [isSelectedDomId, setIsSelectedDomId] = useState<string[]>([]);

  const columns: ColumnDef<ColumnType | any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const row = table.getRowModel().rows;
            if (value) {
              setIsSelectedDomId(row.map((row) => row.original.id));
            } else {
              setIsSelectedDomId([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.getToggleSelectedHandler()(!!value);
            setIsSelectedDomId([...isSelectedDomId, row.original.id]);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    ...domainColumn
  ];
  const onCLickAddDomain = () => {
    if (isSelectedDomId.length > 0) {
      setIsOpen(true);
      return;
    }
    showToast('Failed', 'Please select domain to add to a center');
    return;
  };
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <div className="flex items-start justify-between">
          <Heading
            title={`Add Domain`}
            description="Add domain to your center"
          />
          <Button className="text-xs md:text-sm" onClick={onCLickAddDomain}>
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={columns}
          data={isLoading ? [] : data.data}
        />
      </div>
      {isOpen && (
        <AddCentreDomain
          domain_id={isSelectedDomId}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default CenterDomainPage;
