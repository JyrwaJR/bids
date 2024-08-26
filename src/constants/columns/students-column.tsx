import { OptionsT } from '@components/form/type';
import { StudentRegistrationModelType } from '@models/student';
import { ColumnDef } from '@tanstack/react-table';
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
];
export const studentsColumn: ColumnDef<StudentRegistrationModelType>[] = [
  {
    accessorKey: 'full_name',
    header: 'Name'
  },
  {
    accessorKey: 'gender',
    header: 'Gender'
  }
];
    // {
    //         "id": "9cc3b56c-1a87-472d-964d-a5e77663ed11",
    //         "full_name": "Jet Lee",
    //         "registration_id": "9cc3b209-253a-42fe-af46-8a14a4a0beeb",
    //         "admission_no": "240",
    //         "admission_date": "2024-08-25",
    //         "status": "Allotted"
    //     }
export const listStudentColumn:ColumnDef<StudentRegistrationModelType>[] = [
  {
    accessorKey: 'full_name',
    header: 'Name'
  },
  {
    accessorKey: 'admission_no',
    header: 'Admission No'
  },
  {
    accessorKey: 'admission_date',
    header: 'Admission Date'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
]
