import { OptionsT } from "@components/form/type";
import { StudentRegistrationModelType } from "@models/student";
import { ColumnDef } from "@tanstack/react-table";
export const searchStudentsBy: OptionsT[] = [
  {
    label: 'Name',
    value: 'name'
  },
  {
    label: 'Email',
    value: 'email'
  },
  {
    label: 'Gender',
    value: 'gender'
  }
]
export const studentsColumn: ColumnDef<StudentRegistrationModelType>[] = [
  {
    accessorKey: 'first_name',
    header: 'Name'
  },
  {
    accessorKey: 'gender',
    header: 'Gender'
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <>{row.getValue<string>('email') ?? 'N/A'}</>;
    }
  }
]

