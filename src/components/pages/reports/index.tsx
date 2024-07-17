import { columns } from '@components/tables/employee-tables/columns';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import React from 'react';
import { CSVLink } from 'react-csv';
import { CentreColumn } from '../../../constants/columns/center-column';
import { Button } from '@components/ui/button';
import { Download } from 'lucide-react';

const ReportPage = () => {
  const { data, isFetched } = useCQuery({
    url: 'centre',
    queryKey: ['get', 'centre']
  });

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-start justify-between">
        <Heading title={`Report`} description="Manage ur center Report" />
        {isFetched && (
          <Button asChild>
            <CSVLink
              aria-disabled="true"
              about="Download Report"
              filename="centre-report.csv"
              className="flex items-center justify-center gap-2"
              data={isFetched ? data.data : []}
            >
              Report
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

export default ReportPage;
