'use client';
import { BanIcon, EyeIcon, Plus } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';
import { useCQuery } from '@hooks/useCQuery';
import { ScrollArea } from '@components/ui/scroll-area';
import { ColumnDef } from '@tanstack/react-table';
import { eventsMangementColumn } from '@constants/columns/events-management';
import { OptionsT } from '@components/form/type';
import { useAuthContext } from '@context/auth';
import { CForm } from '@components/form';
import { useForm, useWatch } from 'react-hook-form';
import { Form } from '@components/ui/form';
import { showToast } from '@components/ui/show-toast';
import { FailedToastTitle } from '@constants/toast-message';
import { useCMutation } from '@hooks/useCMutation';
import { CellAction } from '@components/cell-action';
import { AlertModal } from '@components/modal/alert-modal';
import { UpdateEventsManagement } from './update-events-managements';
import { Icons } from '@components/icons';
import { UploadEventsMangementImage } from './upload-event-mangement-image';
import {
  centreQueryKey,
  eventsManagementQueryKey
} from '@constants/query-keys';
import { EventManagementModelType } from '@models/events-management-model';
import { ViewImages } from '@components/view-images';
import { useRouter } from 'next/navigation';
import { ViewEvents } from './view-events';
import { useCategorySelectOptions } from '@hooks/useCategorySelectOptions';

type ImageT = {
  image: string;
  id: string;
  event_management_id: string;
};
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
];
const defaultEventsManagement: EventManagementModelType = {
  event_name: '',
  event_date: '',
  extended_till: '',
  event_location: '',
  remarks: '',
  status: '',
  men: 0,
  women: 0,
  youth: 0,
  social_organisation: 0,
  community_leaders: 0,
  id: '',
  total_participants: 0
};
export const EventsManagementPage = () => {
  const { user } = useAuthContext();
  const [openViewImages, setOpenViewImages] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<ImageT[]>();
  const [isSelectedEvent, setIsSelectedEvent] =
    useState<EventManagementModelType>(defaultEventsManagement);
  const [isDelConfirm, setIsDelConfirm] = useState<boolean>(false);
  const [viewEvents, setViewEvents] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSelectedId, setIsSelectedId] = useState<string>('');
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const isSuperAdmin: boolean = user?.role === 'superadmin';
  const { options } = useCategorySelectOptions();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      centre_id: isSuperAdmin ? 'all' : user?.centre_id
    }
  });
  const url =
    isSuperAdmin && form.watch('centre_id') === 'all'
      ? 'events'
      : `events/get-event-by-centre/${user?.centre_id}`;
  const uri = `events/get-event-by-centre/${form.watch('centre_id')}`;
  const { data, isFetched, isLoading, refetch } = useCQuery({
    url: form.watch('centre_id') !== '' ? uri : url,
    queryKey: [eventsManagementQueryKey]
  });
  const watchCenterId = useWatch({
    control: form.control,
    name: 'centre_id'
  });
  const delMutate = useCMutation({
    url: `events/${isSelectedId}`,
    method: 'DELETE',
    queryKey: eventsManagementQueryKey
  });

  const centreOptions: OptionsT[] = [
    {
      label: 'All',
      value: 'all'
    },
    ...options.centre // Merge cOptions with centreOptions
  ];
  const onDeleteEvents = async () => {
    try {
      if (!!isSelectedId) {
        showToast(FailedToastTitle, 'Please select an event to delete');
      }
      await delMutate.mutateAsync({});
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    } finally {
      setIsSelectedId('');
      setIsDelConfirm(false);
      refetch();
    }
  };
  const updatedColumn: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 300,
      cell: ({ row }) => {
        return (
          <Button
            className="text-nowrap"
            onClick={() => {
              if (row.original.id) {
                console.log(row.original);
                setIsSelectedEvent(row.original);
                setViewEvents(true);
              }
            }}
            size={'icon'}
            variant={'link'}
          >
            {row.original.event_name}
          </Button>
        );
      }
    },
    ...eventsMangementColumn,
    {
      header: 'Upload',
      cell: ({ row }) => {
        return (
          <Button
            disabled={isUploading}
            onClick={() => {
              if (row.original.id) {
                setIsSelectedId(row.original.id);
                setIsUploading(true);
              }
            }}
            size={'icon'}
            variant={'link'}
          >
            <Icons.upload className="h-4 w-4" />
          </Button>
        );
      }
    },
    {
      header: 'View',
      cell: ({ row }) => {
        return (
          <Button
            disabled={row.original.event_images?.length === 0}
            onClick={() => {
              if (row.original.id) {
                setSelectedImages(row.original.event_images);
                if (
                  row.original.event_images &&
                  row.original.event_images.length > 0
                ) {
                  setOpenViewImages(true);
                }
              }
            }}
            size={'icon'}
            variant={'link'}
          >
            {row.original.event_images?.length === 0 ? (
              <BanIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}{' '}
          </Button>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <CellAction
            onEdit={() => {
              if (row.original) {
                setIsSelectedEvent(row.original);
                setIsUpdate(true);
              }
            }}
            onDelete={() => {
              const id = row.original.id;
              if (id) {
                setIsSelectedId(id);
                setIsDelConfirm(true);
              }
            }}
          />
        );
      }
    }
  ];
  const onCloseUpdate = () => {
    setIsSelectedEvent(defaultEventsManagement);
    setIsSelectedId('');
    setIsUpdate(false);
  };

  const onChangeCentreId = useCallback(() => {
    if (watchCenterId) {
      refetch();
    }
  }, [watchCenterId, refetch]);

  useEffect(() => {
    onChangeCentreId();
  }, [onChangeCentreId]);

  return (
    <ScrollArea>
      <div className="flex-1 space-y-4 px-1">
        <div className="flex items-start justify-between space-x-2">
          <div className="flex items-center space-x-2">
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
            <div></div>
          </div>
          <Button
            disabled={!isFetched}
            className="text-xs md:text-sm"
            onClick={() => router.push('/dashboard/events/add-events')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
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
      {isUpdate && (
        <UpdateEventsManagement
          data={isSelectedEvent}
          open={isUpdate}
          onClose={onCloseUpdate}
        />
      )}
      {isUploading && (
        <UploadEventsMangementImage
          id={isSelectedId}
          open={isUploading}
          onClose={() => setIsUploading(false)}
        />
      )}
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
      {openViewImages && (
        <ViewImages
          open={openViewImages}
          onClose={() => setOpenViewImages(false)}
          images={selectedImages}
        />
      )}
      {viewEvents && (
        <ViewEvents
          open={viewEvents}
          onClose={() => setViewEvents(false)}
          data={isSelectedEvent}
        />
      )}
    </ScrollArea>
  );
};
