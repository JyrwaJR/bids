import { AttendanceModelType } from '@models/attendance-model';
import { ColumnDef } from '@tanstack/react-table';

export const attendanceColumn: ColumnDef<AttendanceModelType>[] = [
  {
    accessorKey: 'date',
    header: 'Date'
  }
];
