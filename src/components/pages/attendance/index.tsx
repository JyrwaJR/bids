import { Form } from '@components/ui/form';
import React, { useCallback, useEffect, useMemo } from 'react';
import { AddAttendance } from './add-attendance';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';
import { attendanceColumn } from '@constants/columns/attendance';
import { useCQuery } from '@hooks/useCQuery';
import {
  attendanceQueryKey,
  batchQueryKey,
  domainQueryKey
} from '@constants/query-keys';

import { AttendanceModelType } from '@models/attendance-model';
import { useQuery } from 'react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { ScrollArea } from '@components/ui/scroll-area';
import { useCMutation } from '@hooks/useCMutation';
import { z } from 'zod';
import { format } from 'date-fns';
import { axiosInstance } from '@lib/utils';
import { FormFieldType } from '@components/index';
import { AxiosError } from 'axios';
import { FailedToastTitle } from '@constants/toast-message';
import { showToast } from '@components/ui/show-toast';
import { OptionsT } from '@components/form/type';
import { CForm } from '@components/form';
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

export const AttendancePage = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const form = useForm<AttendanceModelType>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: today
    }
  });
  const dateChanged = useWatch({ control: form.control, name: 'date' });
  const batchChanged = useWatch({ control: form.control, name: 'batch_id' });
  const {
    data,
    isError,
    isLoading,
    mutateAsync: AttendanceMutate
  } = useCMutation({
    url: 'attendance',
    queryKey: attendanceQueryKey,
    method: 'POST'
  });

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
  const batchQuery = useCQuery({ url: 'batch', queryKey: batchQueryKey });
  const domainQuery = useCQuery({ url: 'domain', queryKey: domainQueryKey });
  const onChangeDateOrBatch = useCallback(() => {
    if (dateChanged || batchChanged) {
      attendanceQuery.refetch();
    }
  }, [dateChanged, batchChanged, attendanceQuery]);
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
  const onSubmit = async (data: AttendanceModelType) => {
    try {
      await AttendanceMutate(data);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <ScrollArea>
      <div className="flex-1 space-y-4">
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="new-attendance">New Attendance </TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="space-y-4">
            <div className="flex w-full flex-col space-y-4">
              <div className="flex items-start justify-between space-y-2">
                <Heading title={`Attendance`} description="Manage Attendance" />
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
                  <Button
                    disabled={attendanceQuery.isFetching}
                    className="mt-4"
                  >
                    Search
                  </Button>
                </form>
              </Form>
              <Separator />
              <DataTable
                searchKey="name"
                columns={attendanceColumn}
                isLoading={isLoading}
                data={!isError && data && data.data ? data.data.data ?? [] : []}
              />
            </div>
          </TabsContent>
          <TabsContent value="new-attendance" className="space-y-4">
            <AddAttendance />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};
