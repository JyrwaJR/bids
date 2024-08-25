'use client';
import { Plus } from 'lucide-react';
import React, { useEffect } from 'react';

import { Form, FormControl, FormField, FormItem } from '@components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { staffColumn } from '@constants/columns';
import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';

import { useCQuery } from '@hooks/useCQuery';
import { ScrollArea } from '@components/ui/scroll-area';
import { staffQueryKey } from '@constants/query-keys';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@context/auth';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';

const Schema = z.object({
  centre_id: z.string().uuid().optional()
});
type SchemaType = z.infer<typeof Schema>;
const StaffPage = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { options } = useCategorySelectOptions();
  const isSuperUser = user?.role === 'superadmin';
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema)
  });
  // fetch from staff/{centre_id} when centre_id is changed
  const url = isSuperUser
    ? `staff/${form.getValues('centre_id') ?? user.centre_id}`
    : `staff`;

  const { data, isFetched, isError, isLoading, refetch } = useCQuery({
    url: url,
    queryKey: staffQueryKey
  });

  const watchCentreChange = useWatch({
    control: form.control,
    name: 'centre_id'
  });

  useEffect(() => {
    if (watchCentreChange) {
      refetch();
    }
  }, [watchCentreChange, refetch]);

  return (
    <ScrollArea>
      <div className="flex w-full flex-col space-y-4">
        <div className="flex items-start justify-between space-y-2">
          <div className="flex items-center justify-between space-x-2">
            <Heading title={`Staff`} description="Manage Staff" />
            {isSuperUser && (
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="centre_id"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Centre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Center</SelectLabel>
                            {options.centre.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </Form>
            )}
          </div>
          <Button
            size={'sm'}
            className="text-xs md:text-sm"
            onClick={() => router.push('/dashboard/staff/add-staff')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={staffColumn}
          isLoading={isLoading}
          data={
            isFetched && !isError && data && data.data
              ? data.data.data ?? []
              : []
          }
        />
      </div>
    </ScrollArea>
  );
};
export default StaffPage;
