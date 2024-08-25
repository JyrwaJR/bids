import { Button } from '@components/ui/button';

import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { domainColumn } from '@constants/columns';
import { OptionsT } from '@components/form/type';
import { domainQueryKey } from '@constants/query-keys';
import { ColumnDef } from '@tanstack/react-table';
import { UpdateDomain } from './update-domain';
import { DomainModelType } from '@models/domain-model';
import { CellAction } from '@components/cell-action';
import { useRouter } from 'next/navigation';

const searchDomainBy: OptionsT[] = [
  {
    label: 'Domain',
    value: 'name'
  },
  {
    label: 'status',
    value: 'status'
  }
];
const DomainPage = () => {
  const router = useRouter();
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainModelType>();
  const { data, isFetched, isLoading, isError, refetch } = useCQuery({
    url: 'domain',
    queryKey: domainQueryKey
  });
  const column: ColumnDef<DomainModelType>[] = [
    ...domainColumn,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <CellAction
            onEdit={() => {
              if (row.original.id) {
                setSelectedDomain(row.original);
                setOpenUpdate(true);
              }
            }}
          />
        );
      }
    }
  ];
  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Domain`} description="Manage Domain table" />
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push('/dashboard/domain/add-domain')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Domain
          </Button>
        </div>
        <Separator />
        <DataTable
          searchOptions={searchDomainBy}
          refetch={refetch}
          isLoading={isLoading}
          searchKey="name"
          columns={column}
          data={isFetched && !isLoading && !isError ? data.data : []}
        />
      </div>
      {openUpdate && (
        <UpdateDomain
          open={openUpdate}
          data={{
            name: selectedDomain?.name ?? '',
            status: selectedDomain?.status ?? '',
            id: selectedDomain?.id,
            level: selectedDomain?.level,
            duration: selectedDomain?.duration ?? 0,
            qp_code: selectedDomain?.qp_code ?? '',
            sector: selectedDomain?.sector ?? ''
          }}
          id={selectedDomain?.id ?? ''}
          onClose={() => setOpenUpdate(false)}
        />
      )}
    </>
  );
};

export default DomainPage;
