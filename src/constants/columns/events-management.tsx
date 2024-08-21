import { EventManagementModelType } from '@models/events-management-model';
import { ColumnDef } from '@tanstack/react-table';

export const eventsMangementColumn: ColumnDef<EventManagementModelType>[] = [
  {
    accessorKey: 'event_name',
    header: 'Name'
  },
  {
    accessorKey: 'user',
    header: 'User'
  },
  {
    accessorKey: 'event_location',
    header: 'Location'
  },
  {
    accessorKey: 'men',
    header: ' Male'
  },
  {
    accessorKey: 'women',
    header: ' Female'
  },
  {
    accessorKey: 'youth',
    header: ' Youth'
  },
  {
    accessorKey: 'event_date',
    header: 'Date'
  },
  {
    accessorKey: 'total_participants',
    header: 'Total Participants'
  }
];
