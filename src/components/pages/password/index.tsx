import { useAuthContext } from '@context/auth';

import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import React, { useState } from 'react';
import { DataTable } from '@components/ui/data-table';
import { DomainModelType } from '@models/domain-model';
import { CellAction } from '@components/cell-action';
import { ColumnDef } from '@tanstack/react-table';
import { ChangeUserPassword } from './change-user-password';

export const PasswordPage = () => {
  const { user } = useAuthContext();
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const { data, isFetched, isLoading, isError, refetch } = useCQuery({
    url: 'get-user',
    queryKey: ['change-password']
  });
  const column: ColumnDef<any>[] = [
    {
      id: 'name',
      header: 'User name',
      cell: ({ row }) => {
        return <div>{row.original.name}</div>;
      }
    },
    {
      id: 'email',
      header: 'Email'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <CellAction
            onEdit={() => {
              if (row.original.id) {
                setId(row.original.id);
                setOpen(true);
              }
            }}
          />
        );
      }
    }
  ];
  if (user?.role !== 'superadmin' && user?.role !== 'cooridinator') {
    return <div>Unauthorized</div>;
  }
  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Change User Password`}
            description="Manage Password table"
          />
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          refetch={refetch}
          isLoading={isLoading}
          enableSearch={false}
          columns={column}
          data={isFetched && !isLoading && !isError ? data.data : []}
        />
        {open && (
          <ChangeUserPassword
            id={id}
            open={open}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </>
  );
};
