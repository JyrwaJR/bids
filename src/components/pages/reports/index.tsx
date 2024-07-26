import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import React from 'react';
import { CSVLink } from 'react-csv';
import { CentreColumn } from '../../../constants/columns/center-column';
import { Button } from '@components/ui/button';
import { Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { reportQueryKey } from '@constants/query-keys';

export const ReportPage = () => {
  const search = useSearchParams().get('reports');
  console.log(search);
  const { data, isFetched } = useCQuery({
    url: search ? search : 'centre',
    queryKey: [reportQueryKey, search]
  });

  return (
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
      <Separator />
      <DataTable
        searchKey="name"
        columns={CentreColumn}
        data={isFetched ? data.data : []}
      />
    </div>
  );
};
