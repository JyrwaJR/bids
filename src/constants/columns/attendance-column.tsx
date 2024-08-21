import { AttendanceModelType } from '@models/attendance-model';
import { ColumnDef } from '@tanstack/react-table';

export const attendanceColumn: ColumnDef<AttendanceModelType>[] = [
  {
    accessorKey: 'batch',
    header: 'Batch'
  },
  {
    accessorKey: 'date',
    header: 'Date'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  }
];
