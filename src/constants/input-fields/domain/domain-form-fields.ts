import { FormFieldType } from '@components/index';
import { SectorsOptions, StatusOptions } from '@constants/options';
export const domainFormFields: FormFieldType[] = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'status',
    label: 'Status',
    select: true,
    options: StatusOptions
  },
  {
    name: 'level',
    label: 'Level',
    type: 'number'
  },
  {
    name: 'qp_code',
    label: 'QP-Code'
  },
  {
    name: 'curriculum',
    label: 'Curriculum',
    type: 'file',
    accept: 'application/pdf,image/*'
  },
  {
    name: 'guide',
    label: 'Guide',
    type: 'file',
    accept: 'application/pdf,image/*'
  },
  {
    name: 'duration',
    label: 'Duration',
    type: 'number',
    required: true
  },
  {
    name: 'last_review',
    label: 'Last Review',
    type: 'date'
  },
  {
    name: 'next_review',
    label: 'Next Review',
    type: 'date'
  },
  {
    name: 'sector',
    label: 'Sector',
    select: true,
    options: SectorsOptions
  }
];
