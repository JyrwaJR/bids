import React, { useCallback, useEffect, useRef } from 'react';
import { showToast } from '@components/ui/show-toast';
import { attendanceQueryKey, batchQueryKey } from '@constants/query-keys';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { ScrollArea } from '@components/ui/scroll-area';
import { Heading } from '@components/ui/heading';
import { useCQuery } from '@hooks/useCQuery';
import { FailedToastTitle } from '@constants/toast-message';
import { OptionsT } from '@components/form/type';
import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { CForm, FormFieldType } from '@components/form';
import { Separator } from '@components/ui/separator';
import { Form } from '@components/ui/form';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { z } from 'zod';
import { AttendanceModelType } from '@models/attendance-model';
import { axiosInstance } from '@lib/utils';
import { attendanceColumn } from '@constants/columns/attendance-column';
import { debounce } from 'lodash';
const getAttendanceByBatchId = async (batchId: string, date?: string) => {
  try {
    if (!batchId) {
      return;
    }
    const res = await axiosInstance.get(`/attendance/${batchId}/${date}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const schema = z.object({
  batch_id: z.string().uuid(),
  domain_id: z.string().uuid().optional(),
  date: z
    .string()
    .refine((v) => format(new Date(v), 'yyyy-MM-dd') !== 'invalid date')
    .optional()
});

const getStudentFields: FormFieldType[] = [
  { name: 'batch_id', label: 'Batch', select: true },
  { name: 'date', label: 'Date', type: 'date' }
];

export const AttendancePage = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const form = useForm<AttendanceModelType>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: today
    }
  });
  const watch_batch_id = useWatch({ control: form.control, name: 'batch_id' });
  const watch_date = useWatch({ control: form.control, name: 'date' });
  const batchQuery = useCQuery({ url: 'batch', queryKey: batchQueryKey });
  const attendanceQuery = useQuery({
    queryFn: async () =>
      await getAttendanceByBatchId(watch_batch_id, watch_date),
    queryKey: attendanceQueryKey,
    enabled: false,
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        showToast(FailedToastTitle, error.response?.data.message);
      }
      showToast(FailedToastTitle, error.message);
    }
  });
  const prevBatchId = useRef<string | undefined>(undefined);
  const prevDate = useRef<string | undefined>(undefined);
  const debouncedRefetch = useRef(
    debounce(() => {
      attendanceQuery.refetch();
    }, 1000) // Adjust the delay as needed
  ).current;

  const onChangeDateOrBatch = useCallback(() => {
    if (
      watch_batch_id !== prevBatchId.current ||
      watch_date !== prevDate.current
    ) {
      debouncedRefetch();
      prevBatchId.current = watch_batch_id;
      prevDate.current = watch_date;
    }
  }, [watch_batch_id, watch_date, debouncedRefetch]);

  useEffect(() => {
    onChangeDateOrBatch();
  }, [onChangeDateOrBatch]);

  const batchOptions: OptionsT[] = batchQuery.isFetched
    ? batchQuery.data.data.map((item: { id: string; batch_code: string }) => ({
        label: item.batch_code,
        value: item.id
      }))
    : [];

  const updatedFields: FormFieldType[] = getStudentFields.map((field) => {
    if (field.select) {
      switch (field.name) {
        case 'batch_id':
          return { ...field, options: batchOptions };
        default:
          return field;
      }
    }
    return field;
  });

  return (
    <ScrollArea>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between space-y-2">
          <Heading title="New Attendance" description="Manage Attendance" />
        </div>
        <Form {...form}>
          <div className="flex flex-col items-start justify-start space-x-2 md:flex-row md:items-center md:justify-start">
            <div>
              <CForm
                form={form}
                fields={updatedFields}
                loading={attendanceQuery.isFetching}
                className="md:col-span-6"
              />
            </div>
            <Button
              disabled={attendanceQuery.isFetching}
              onClick={debouncedRefetch}
              className="mt-4"
            >
              Search
            </Button>
          </div>
        </Form>
        <Separator />
        <DataTable
          searchKey="batch"
          columns={attendanceColumn}
          className="h-full"
          isLoading={attendanceQuery.isFetching}
          data={
            attendanceQuery.isFetched && attendanceQuery.data
              ? attendanceQuery.data.data
              : []
          } // Use appropriate data source
        />
      </div>
    </ScrollArea>
  );
};
