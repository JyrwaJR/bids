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
import { ProjectColumn, domainColumn } from '@constants/columns';
import { ColumnDef } from '@tanstack/react-table';
import { sectorColumn } from '@constants/columns/sector-column';
import { BatchColumn } from '@constants/columns/batch-column';

export const ReportPage = () => {
  const search = useSearchParams().get('reports');
  const isDefaultReportUrl = !!search ? search : 'centre';
  const { data, isFetched } = useCQuery({
    queryKey: [reportQueryKey, search],
    url: isDefaultReportUrl
  });
  const getColumns = (): ColumnDef<any>[] => {
    switch (search) {
      case 'centre':
        return CentreColumn;
      case 'domain':
        return domainColumn;
      case 'project':
        return ProjectColumn;
      case 'sector':
        return sectorColumn;
      case 'batch':
        return BatchColumn;
      case 'admission':
        return BatchColumn;
      default:
        return CentreColumn;
    }
  };
  return (
    <Suspense>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Reports ${search}`}
            description={`Manage ${search} reports`}
            className="capitalize"
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
          columns={getColumns()}
          data={isFetched && data.data ? data.data : []}
        />
      </div>
    </Suspense>
  );
};
