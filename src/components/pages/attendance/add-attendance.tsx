import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@components/ui/data-table';
import { Separator } from '@components/ui/separator';
import { showToast } from '@components/ui/show-toast';
import { Checkbox } from '@components/ui/checkbox';
import { CForm, FormFieldType } from '@components/form';
import { OptionsT } from '@components/form/type';

import {
  attendanceQueryKey,
  batchQueryKey,
  domainQueryKey
} from '@constants/query-keys';
import { FailedToastTitle } from '@constants/toast-message';
import { useCQuery } from '@hooks/useCQuery';
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

export const AddAttendance: React.FC = () => {
  const [isAbsentStudents, setIsAbsentStudents] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const form = useForm<AttendanceModelType>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: today
    }
  });

  const watch_batch_id = useWatch({ control: form.control, name: 'batch_id' });
  const watch_date = useWatch({ control: form.control, name: 'date' });
  const domainQuery = useCQuery({ url: 'domain', queryKey: domainQueryKey });
  const batchQuery = useCQuery({ url: 'batch', queryKey: batchQueryKey });
  const attendanceQuery = useQuery({
    queryFn: async () =>
      await getAttendanceByBatchId(watch_batch_id, watch_date),
    queryKey: [attendanceQueryKey, today],
    enabled: !!watch_batch_id,
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        showToast(FailedToastTitle, error.response?.data.message);
      }
      showToast(FailedToastTitle, error.message);
    }
  });
  const onChangeDateOrBatch = useCallback(() => {
    if (watch_batch_id || watch_date) {
      attendanceQuery.refetch();
    }
  }, [watch_batch_id, watch_date, attendanceQuery]);
  useEffect(() => {
    onChangeDateOrBatch();
  }, [onChangeDateOrBatch]);

  const domainOptions: OptionsT[] = useMemo(
    () =>
      domainQuery.isFetched && domainQuery.data
        ? domainQuery.data.data.map((item: { id: string; name: string }) => ({
            label: item.name,
            value: item.id
          }))
        : [],
    [domainQuery]
  );

  const batchOptions: OptionsT[] = useMemo(
    () =>
      batchQuery.isFetched && batchQuery.data
        ? batchQuery.data.data.map(
            (item: { id: string; batch_code: string }) => ({
              label: item.batch_code,
              value: item.id
            })
          )
        : [],
    [batchQuery]
  );

  const updatedFields: FormFieldType[] = useMemo(
    () =>
      getStudentFields.map((field) => {
        if (field.select) {
          switch (field.name) {
            case 'domain_id':
              return { ...field, options: domainOptions };
            case 'batch_id':
              return { ...field, options: batchOptions };
            default:
              return field;
          }
        }
        return field;
      }),
    [domainOptions, batchOptions]
  );
  const columns: ColumnDef<any>[] = [
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
            if (value && row.original.id) {
              row.getToggleSelectedHandler()(!!value);
              setIsAbsentStudents([...isAbsentStudents, row.original.id]);
            } else {
              row.getToggleSelectedHandler()(!!value);
              setIsAbsentStudents([
                ...isAbsentStudents.filter((id) => id !== row.original.id)
              ]);
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    }
  ];
  const onSubmit: SubmitHandler<AttendanceModelType> = () => {
    attendanceQuery.refetch();
  };
  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex items-start justify-between space-y-2">
        <Heading title="New Attendance" description="Manage Attendance" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center space-x-2"
        >
          <div>
            <CForm
              form={form}
              fields={updatedFields}
              loading={false}
              className="col-span-6"
            />
          </div>
          <Button disabled={attendanceQuery.isFetching} className="mt-4">
            Search
          </Button>
        </form>
      </Form>
      <Separator />
      <DataTable
        searchKey="batch"
        onClick={() => {
          if (isAbsentStudents.length > 0) {
            setOpen(true);
          }
        }}
        columns={columns}
        disabled={isAbsentStudents.length > 0 ? false : true}
        className="h-full"
        isLoading={false}
        // TODO: correct data add
        data={attendanceQuery.data ?? []} // Use appropriate data source
      />
      {open && (
        <SaveAttendance
          batch_id={form.getValues('batch_id')}
          open={isAbsentStudents.length > 0 && open}
          ids={isAbsentStudents}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
