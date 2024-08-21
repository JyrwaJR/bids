import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { BatchColumn } from '@constants/columns/batch-column';
import { useCQuery } from '@hooks/useCQuery';
import { batchQueryKey } from '@constants/query-keys';
const BatchPage = () => {
  const batchQuery = useCQuery({
    url: 'batch',
    queryKey: batchQueryKey
  });

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="">
          <Heading title={`Batch`} description="Manage Batch table" />
        </div>
        <DataTable
          searchKey="batch_code"
          isLoading={batchQuery.isLoading}
          columns={BatchColumn}
          data={
            batchQuery.isFetched &&
            !batchQuery.isError &&
            !batchQuery.isLoading &&
            batchQuery.data
              ? batchQuery.data.data
              : []
          }
        />
      </div>
    </>
  );
};

export default BatchPage;
