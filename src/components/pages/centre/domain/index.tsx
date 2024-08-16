import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { showToast } from '@components/ui/show-toast';
import { domainColumn } from '@constants/columns';
import { useCQuery } from '@hooks/useCQuery';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import {
  CenterDomainModel,
  CenterDomainModelType,
  DomainModelType
} from '@src/models';
import { centreQueryKey, domainQueryKey } from '@constants/query-keys';
import { useCMutation } from '@hooks/useCMutation';
import { FailedToastTitle, SuccessToastTitle } from '@constants/toast-message';
import { FormFieldType, OptionsT } from '@components/form/type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@components/ui/form';
import { CForm } from '@components/form';
interface ColumnType extends DomainModelType {
  id: string;
}
const CenterDomainPage = () => {
  const [isSelectedDomId, setIsSelectedDomId] = useState<string[]>([]);
  const form = useForm<CenterDomainModelType>({
    resolver: zodResolver(CenterDomainModel),
    defaultValues: {
      domain_id: isSelectedDomId
    }
  });
  const { data: domainsData, isLoading: domainLoading } = useCQuery({
    url: 'domain',
    queryKey: domainQueryKey
  });

  const { mutateAsync, isLoading } = useCMutation({
    url: 'centre-domain/save',
    method: 'POST',
    queryKey: [...domainQueryKey, ...centreQueryKey]
  });

  const {
    data: centreData,
    isLoading: loading,
    isFetched
  } = useCQuery({
    url: 'centre',
    queryKey: centreQueryKey
  });
  const onSubmit: SubmitHandler<CenterDomainModelType> = async (data) => {
    try {
      if (isSelectedDomId.length > 0) {
        const res = await mutateAsync({
          ...data,
          domain_id: isSelectedDomId
        });
        if (res.success) {
          setIsSelectedDomId([]);
          showToast(SuccessToastTitle, res.message);
          return;
        }
      }
      showToast(FailedToastTitle, 'Please select atleast one domain');
      return;
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
      return;
    }
  };

  const centreOptions: OptionsT[] | undefined =
    isFetched &&
    !isLoading &&
    centreData.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }));

  const fields: FormFieldType[] = [
    {
      name: 'centre_id',
      label: 'Select Centre',
      select: true,
      options: centreOptions,
      required: true
    }
  ];
  const columns: ColumnDef<ColumnType | any>[] = [
    {
      id: 'select',
      cell: ({ row }) => (
        <Checkbox
          checked={isSelectedDomId.includes(row.original.id)}
          onCheckedChange={() => {
            setIsSelectedDomId((prevSelected) => {
              if (prevSelected.includes(row.original.id)) {
                return prevSelected.filter((id) => id !== row.original.id);
              } else {
                return [...prevSelected, row.original.id];
              }
            });
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    ...domainColumn
  ];
  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-start">
          <Heading
            title={`Center Domain`}
            description="Please select a domain center"
          />
        </div>
        <Separator />
        <Form {...form}>
          <div className="flex items-center space-x-2">
            <CForm
              form={form}
              loading={isLoading || loading || !isFetched}
              fields={fields}
              className="w-full"
            />
            <div className="pt-4">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={
                  isLoading || !isFetched || isSelectedDomId.length === 0
                }
              >
                Save{' '}
              </Button>
            </div>
          </div>
        </Form>
        <Separator />
        <DataTable
          searchKey="name"
          columns={columns}
          data={domainLoading ? [] : domainsData.data}
        />
      </div>
    </>
  );
};

export default CenterDomainPage;
