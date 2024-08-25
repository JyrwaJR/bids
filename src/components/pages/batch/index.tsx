import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { BatchColumn } from '@constants/columns/batch-column';
import { useCQuery } from '@hooks/useCQuery';
import { batchQueryKey } from '@constants/query-keys';
import { Button } from '@components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
const BatchPage = () => {
  const router = useRouter();
  const batchQuery = useCQuery({
    url: 'batch',
    queryKey: batchQueryKey
  });

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Batch`} description="Manage Batch table" />
          <Button onClick={() => router.push('/dashboard/batch/add-batch')}>
            <PlusIcon /> Add Batch
          </Button>
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
