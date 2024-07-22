import { EventManagementModelType } from "@models/events-management-model";
import { ColumnDef } from "@tanstack/react-table";

export const eventsMangementColumn: ColumnDef<EventManagementModelType>[] = [
  {
    accessorKey: 'event_name',
    header: 'Name'
  },
  {
    accessorKey: 'Location',
    header: 'Location'
  },
  {
    accessorKey: 'men',
    header: 'Total Men'
  },
  {
    accessorKey: 'women',
    header: 'Total Women'
  },
  {
    accessorKey: 'total_participants',
    header: 'Total Participants'
  }
]
