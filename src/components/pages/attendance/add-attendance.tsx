import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@components/ui/data-table';
import { Separator } from '@components/ui/separator';
import { showToast } from '@components/ui/show-toast';
import { Checkbox } from '@components/ui/checkbox';
import { CForm, FormFieldType } from '@components/form';
import { OptionsT } from '@components/form/type';
import { batchQueryKey } from '@constants/query-keys';
import { FailedToastTitle } from '@constants/toast-message';
import { AttendanceModelType } from '@models/attendance-model';
import { attendanceColumn } from '@constants/columns/attendance';
import { Heading } from '@components/ui/heading';
import { Form } from '@components/ui/form';
import { Button } from '@components/ui/button';
import { axiosInstance } from '@lib/utils';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { SaveAttendance } from './save-attendance';
import { useCQuery } from '@hooks/useCQuery';
import { debounce } from 'lodash';
const schema = z.object({
  batch_id: z
    .string({
      required_error: 'Batch is required'
    })
    .uuid(),
  date: z
    .string()
    .refine((v) => format(new Date(v), 'yyyy-MM-dd') !== 'invalid date')
    .optional()
});

const searchFormFields: FormFieldType[] = [
  { name: 'batch_id', label: 'Batch', select: true },
  { name: 'date', label: 'Date', type: 'date' }
];

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
// FIX: attencance query is making to many requests when press search so the page freeze on search
// NOTE: This is a temporary fix using debounce
export const AddAttendance: React.FC = () => {
  const [isAbsentStudents, setIsAbsentStudents] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const form = useForm<AttendanceModelType>({
    resolver: zodResolver(schema),
    defaultValues: { date: today }
  });

  const watch_batch_id = useWatch({ control: form.control, name: 'batch_id' });
  const watch_date = useWatch({ control: form.control, name: 'date' });
  const batchQuery = useCQuery({ url: 'batch', queryKey: batchQueryKey });
  const attendanceQuery = useQuery({
    queryFn: async () =>
      await getAttendanceByBatchId(watch_batch_id, watch_date),
    queryKey: [
      'add',
      'attendance',
      form.getValues('batch_id'),
      form.getValues('date')
    ],
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

  const batchOptions: OptionsT[] = batchQuery.data?.data.map(
    (item: { id: string; batch_code: string }) => ({
      label: item.batch_code,
      value: item.id
    })
  );

  const updatedFields: FormFieldType[] = searchFormFields.map((field) => {
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

  const columns: ColumnDef<AttendanceModelType | any>[] = [
    ...attendanceColumn,
    {
      id: 'select',
      header: 'Mark as absent',
      cell: ({ row }) => (
        <Checkbox
          checked={
            row.getIsSelected() ||
            isAbsentStudents.includes(row.original.id ?? '')
          }
          onCheckedChange={(value) => {
            if (row.original.id) {
              const newSelected = value
                ? [...isAbsentStudents, row.original.id]
                : isAbsentStudents.filter((id) => id !== row.original.id);
              setIsAbsentStudents(newSelected);
              row.getToggleSelectedHandler()(!!value);
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    }
  ];
  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex items-start justify-between space-y-2">
        <Heading title="New Attendance" description="Manage Attendance" />
      </div>
      <Form {...form}>
        <div className="flex flex-col items-start justify-center space-x-2 md:flex-row md:items-center md:justify-start">
          <CForm
            form={form}
            fields={updatedFields}
            loading={attendanceQuery.isFetching}
            className="w-full md:col-span-6"
          />
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
        onClick={() => setOpen(isAbsentStudents.length > 0)}
        columns={columns}
        disabled={isAbsentStudents.length === 0}
        className="h-full"
        isLoading={attendanceQuery.isFetching}
        data={attendanceQuery.data?.data ?? []} // Use the fetched data
      />
      {open && (
        <SaveAttendance
          batch_id={form.getValues('batch_id')}
          open={open}
          ids={isAbsentStudents}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
