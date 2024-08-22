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
    label: 'Enrollment Target',
    required: true,
    type: 'number'
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
    label: 'Duration in months',
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
