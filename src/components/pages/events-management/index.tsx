'use client';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { staffColumn } from '@constants/columns';
import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { ScrollArea } from '@components/ui/scroll-area';
import { ColumnDef } from '@tanstack/react-table';
import { AddEventsManagement } from './add-events-management';
import { eventsMangementColumn } from '@constants/columns/events-management';
import { OptionsT } from '@components/form/type';
import { useAuthContext } from '@context/auth';
import { CForm } from '@components/form';
import { useForm } from 'react-hook-form';
import { Form } from '@components/ui/form';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { useCMutation } from '@hooks/useCMutation';
import { CellAction } from '@components/cell-action';
import { AlertModal } from '@components/modal/alert-modal';
import { UpdateEventsManagement } from './update-events-managements';
import { Icons } from '@components/icons';
import { UploadEventsMangementImage } from './upload-event-mangement-image';
import { eventsManagementQueryKey } from '@constants/query-keys';
import { EventManagementModelType } from '@models/events-management-model';

const searyBy: OptionsT[] = [
  {
    label: 'Name',
    value: 'event_name'
  },
  {
    label: 'Location',
    value: 'event_location'
  },
  {
    label: 'Total Men',
    value: 'men'
  },
  {
    label: 'Total Women',
    value: 'women'
  },
  {
    label: 'Total',
    value: 'total_participants'
  }
]
export const EventsManagementPage = () => {
  const { user } = useAuthContext()
  const [isDelConfirm, setIsDelConfirm] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isSelectedId, setIsSelectedId] = useState<string>('')
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const isSuperAdmin: boolean = user?.role === 'superadmin'
  const form = useForm({
    defaultValues: {
      centre_id: isSuperAdmin ? '' : user?.centre_id
    }
  })
  const url = isSuperAdmin ? 'events' : `events/get-event-by-centre/${user?.centre_id}`
  const uri = `events/get-event-by-centre/${form.watch('centre_id')}`
  const { data, isFetched, isError, isLoading, refetch } = useCQuery({
    url: form.watch('centre_id') !== '' ? uri : url,
    queryKey: eventsManagementQueryKey
  });
  const centreQuery = useCQuery({
    url: 'centre',
    queryKey: ['get', 'centre']
  })
  const delMutate = useCMutation({
    url: `events/${isSelectedId}`,
    method: "DELETE",
    queryKey: eventsManagementQueryKey
  })

  const cOptions: OptionsT[] = (centreQuery.isFetched && centreQuery.data?.data)
    ? centreQuery.data.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }))
    : []; // Default to an empty array if data is not fetched

  const centreOptions: OptionsT[] = [
    {
      label: 'All',
      value: ''
    },
    ...cOptions // Merge cOptions with centreOptions
  ];
  const onDeleteEvents = async () => {
    try {
      if (!!isSelectedId) {
        showToast(FailedToastTitle, "Please select an event to delet")
      }
      await delMutate.mutateAsync({})
    } catch (error: any) {
      showToast(FailedToastTitle, error.message)
    } finally {
      setIsSelectedId('')
      setIsDelConfirm(false)
      refetch()
    }
  }
  const updatedColumn: ColumnDef<any>[] = [
    ...eventsMangementColumn,
    {
      header: 'Upload Image',
      cell: ({ row }) => {
        const id = row.original.id
        setIsSelectedId(id)
        return <Button
          disabled={isUploading}
          onClick={() => setIsUploading(true)}
          size={'icon'} variant={'link'}>
          <Icons.upload className='w-4 h-4' />
        </Button>
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const id = row.original.id
        setIsSelectedId(id)
        return <CellAction
          onEdit={() => setIsUpdate(true)}
          onDelete={() => setIsDelConfirm(true)}
        />
      }
    }
  ]

  useEffect(() => {
    refetch()
  }, [form.watch('centre_id')])

  return (
    <ScrollArea>
      <div className="flex-1 px-1 space-y-4">
        <div className="flex space-x-2 items-start justify-between">
          <div className='flex items-center space-x-2'>
            <Heading title={`Events`} description="Manage Events" />
            {user?.role === 'superadmin' && (
              <div>
                <Form {...form}>
                  <CForm
                    form={form}
                    loading={isLoading}
                    fields={[
                      {
                        name: 'centre_id',
                        select: true,
                        options: centreOptions
                      }
                    ]}
                  />
                </Form>
              </div>
            )}
            <div>
            </div>
          </div>
          <Button
            disabled={!isFetched || !user?.role || user?.role !== 'superadmin'}
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="event_name"
          searchOptions={searyBy}
          isLoading={isLoading}
          columns={updatedColumn}
          data={isFetched ? data.data : []}
        />
      </div>
      {isOpen && <AddEventsManagement
        open={isOpen} onClose={() => setIsOpen(false)} />
      }
      {isUpdate && <UpdateEventsManagement
        id={isSelectedId}
        open={isUpdate} onClose={() => setIsUpdate(false)} />
      }
      {isUploading && <UploadEventsMangementImage
        id={isSelectedId}
        open={isUploading} onClose={() => setIsUploading(false)} />
      }
      {isDelConfirm && (
        <AlertModal
          isOpen={isDelConfirm}
          onClose={() => setIsDelConfirm(false)}
          title="Delete Event"
          desc="Are you sure you want to delete this event?"
          loading={!isDelConfirm}
          onConfirm={onDeleteEvents}
        />
      )}
    </ScrollArea>
  );
};
