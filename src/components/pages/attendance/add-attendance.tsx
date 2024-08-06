import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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

  const domainQuery = useCQuery({ url: 'domain', queryKey: domainQueryKey });
  const batchQuery = useCQuery({ url: 'batch', queryKey: batchQueryKey });
  const attendanceQuery = useQuery({
    queryFn: async () =>
      await getAttendanceByBatchId(
        form.getValues('batch_id'),
        form.getValues('date')
      ),
    queryKey: [attendanceQueryKey, today],
    enabled: !!form.watch('batch_id'),
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        showToast(FailedToastTitle, error.response?.data.message);
      }
      showToast(FailedToastTitle, error.message);
    }
  });
  useEffect(() => {
    if (form.watch('batch_id') || form.watch('date')) {
      attendanceQuery.refetch();
    }
  }, [form.watch('batch_id')]);

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
  useEffect(() => {
    console.log('Updated isAbsentStudents:', isAbsentStudents);
  }, [isAbsentStudents]);
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
  const onsubmit: SubmitHandler<AttendanceModelType> = () => {
    attendanceQuery.refetch();
  };
  const dummy = [
    {
      id: '9b1d67ea-8d4a-4e1d-bf57-cae0e1f34c3d',
      batch: '9c66e355-3c72-4d82-a753-bbe22a39951c',
      date: today,
      status: 'present'
    },
    {
      id: 'f14b36d3-0d72-4e24-b530-b2e9a2e2b9a6',
      batch: '1d8f8d7a-48b0-46d5-9f7c-bbde2a4e1c5a',
      date: today,
      status: 'absent'
    },
    {
      id: '4a2e8d4f-5b3d-4b2b-94e4-5e4e84d2b67c',
      batch: '6e1a3c29-2e1f-4e94-bde4-249c74e5c7e2',
      date: today,
      status: 'late'
    },
    {
      id: 'a2c8f2d3-5f7a-4b8b-8d3b-cf4d066d5e5e',
      batch: '3b1b4f6c-d4fb-4a2f-9ed6-5e2b8db0f5f3',
      date: today,
      status: 'present'
    },
    {
      id: 'd6eae83b-bf15-44d1-bd5e-e9f6e3b539e6',
      batch: '54e6f0d8-31c1-4d84-bbb2-dcdf40eec58e',
      date: today,
      status: 'present'
    },
    {
      id: 'bfffb95b-6fc5-4a92-bb14-604dfb30c6fc',
      batch: '7e92b829-7c5c-4efb-9e25-6e6f7a46d07c',
      date: today,
      status: 'absent'
    },
    {
      id: '5b418c3e-89e3-4a9e-9f6c-066d2f46d9d4',
      batch: 'ae1c9a23-5b8e-4e8b-b30e-533c50b03f1b',
      date: today,
      status: 'late'
    },
    {
      id: 'f10470e4-f09c-4c1b-9276-2df4f8a8a244',
      batch: 'b374b08e-2f87-4f87-88f1-e9c632c7d444',
      date: today,
      status: 'present'
    },
    {
      id: 'b1a7644e-e0f1-4fdc-a3d6-2e5d8493fa9e',
      batch: 'f234c012-3c18-4bbf-8c28-735f84db473c',
      date: today,
      status: 'absent'
    },
    {
      id: 'f5350f8b-5b74-4dc2-812c-15d7f97883ae',
      batch: 'c7893e32-8df3-46b7-b55c-e5b04e7d1cf9',
      date: today,
      status: 'present'
    }
  ];
  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex items-start justify-between space-y-2">
        <Heading title="New Attendance" description="Manage Attendance" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
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
