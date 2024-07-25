import { FormFieldType } from '@components/index';
import { SectorsOptions, StatusOptions } from '@constants/options';
export const projectsFields: FormFieldType[] = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'target',
    label: 'Target',
    required: true
  },
  {
    name: 'start_date',
    label: 'Start Date',
    required: true,
    type: 'date'
  },
  {
    name: 'end_date',
    label: 'End Date',
    required: false,
    type: 'date'
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
    required: true
  },
  {
    name: 'target_sector',
    label: 'Target Sector',
    required: true,
    select: true,
    options: SectorsOptions
  }
];
