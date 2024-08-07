import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import React, { Suspense } from 'react';
import { CSVLink } from 'react-csv';
import { CentreColumn } from '../../../constants/columns/center-column';
import { Button } from '@components/ui/button';
import { Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { reportQueryKey } from '@constants/query-keys';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';
import { Form, FormFieldType } from '@components/index';
import { useForm } from 'react-hook-form';

export const ReportPage = () => {
  const search = useSearchParams().get('reports');
  const isDefaultReportUrl = !!search ? search : 'centre';
  const { data, isFetched } = useCQuery({
    queryKey: [reportQueryKey, search],
    url: isDefaultReportUrl
  });
  const form = useForm();
  const { options } = useCategorySelectOptions();
  const fields: FormFieldType[] = [
    {
      name: 'centre_id',
      select: true,
      label: 'Centre',
      options: options.centre
    },
    {
      name: 'domain_id',
      select: true,
      label: 'Domain',
      options: options.domain
    }
  ];
  return (
    <Suspense>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Reports ${search}`}
            description={`Manage ${search} reports`}
          />
          {isFetched && (
            <Button asChild>
              <CSVLink
                aria-disabled="true"
                about="Download Report"
                filename={`${search}-reports`}
                className="flex items-center justify-center gap-2"
                data={isFetched ? data.data : []}
              >
                CSV Report
                <Download className="h-4 w-4" />
              </CSVLink>
            </Button>
          )}
        </div>
        {isFetched && (
          <Form
            btnText="Search"
            className="md:col-span-6"
            form={form}
            fields={fields}
            onSubmit={() => {}}
            loading={!isFetched}
          />
        )}
        <Separator />
        <DataTable
          searchKey="name"
          columns={CentreColumn}
          data={isFetched && data.data ? data.data : []}
        />
      </div>
    </Suspense>
  );
};
