import { FormFieldType } from '@components/index';
import Page from '@src/app/dashboard/centre/page';

export const eventManagementFields: FormFieldType[] = [
  {
    name: 'event_name',
    label: 'Event Name',
    required: true
  },
  {
    name: 'event_date',
    label: 'Event date',
    required: true,
    type: 'date'
  },
  {
    name: 'event_location',
    label: 'Event Location',
    required: true
  },
  {
    name: 'remark',
    label: 'Remark',
    required: true
  },
  {
    name: 'status',
    label: 'Status',
    required: true
  },
  {
    name: 'men',
    label: 'No. of Men',
    required: true
  },
  {
    name: 'women',
    label: 'No. of Women',
    required: true
  },
  {
    name: 'youth',
    label: 'No. of Youth',
    required: true
  },
  {
    name: 'social_organisation',
    label: 'Social Organisation',
    required: true
  },
  {
    name: 'community_leader',
    label: 'Community Leader',
    required: true
  },
  {
    name: 'total_participants',
    label: 'Total Participants',
    required: true
  }
];
