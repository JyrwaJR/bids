import { FormFieldType } from '@components/index';

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
    name: 'remarks',
    label: 'Remarks',
    required: true
  },
  {
    name: 'men',
    label: 'Male',
    required: true,
    type: 'number'
  },
  {
    name: 'women',
    label: 'Female',
    required: true,
    type: 'number'
  },
  {
    name: 'youth',
    label: 'Youth',
    required: true,
    type: 'number'
  },
  {
    name: 'social_organisation',
    label: 'Social Organisation',
    required: true,
    type: 'number'
  },
  {
    name: 'community_leaders',
    label: 'Community Leaders',
    required: true,
    type: 'number'
  },
  {
    name: 'total_participants',
    label: 'Total Participants',
    required: true,
    type: 'number'
  },
  {
    name: 'image',
    label: 'Event Image',
    type: 'file'
  },
  {
    name: 'image_title',
    label: 'Image Title'
  }
];
