import { FormFieldType } from '@components/index';
import { SectorsOptions, StatusOptions } from '@constants/options';
// post -- /project/save
// {
// "name" : "required|string|max:250|unique",
// "target" : "required|integer",
// "start_date" : "required|date",
// "end_date" : "nullable|date",
// "status" : "nullable|string|max:20", //default is active
// "duration" : "required|integer",
// "target_sector" : "required|string|max:20", --> Rural or Urban
// }
// put

export const projectsFields: FormFieldType[] = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'target',
    label: 'Target',
    required: true,
    type: 'number'
  },
  {
    name: 'start_date',
    label: 'Start Date',
    required: true
  },
  {
    name: 'end_date',
    label: 'End Date',
    required: false
  },
  {
    name: 'status',
    label: 'Status',
    required: false,
    select: true,
    options: StatusOptions
  },
  {
    name: 'duration',
    label: 'Duration',
    required: true,
    type: 'number'
  },
  {
    name: 'target_sector',
    label: 'Target Sector',
    required: true,
    select: true,
    options: SectorsOptions
  }
];
