import { FormFieldType } from '@components/index';
import { yesNoOptions } from '@constants/options';

export const bplCategoryFields: FormFieldType[] = [
  {
    name: 'registration_id',
    label: 'Registration ID',
    required: true,
    type: 'text',
    placeholder: 'Enter registration ID'
  },
  {
    name: 'bpl_card_no',
    label: 'BPL Card Number',
    required: false,
    type: 'text',
    placeholder: 'Enter BPL card number'
  },
  {
    name: 'bpl_card_issue',
    label: 'BPL Card Issue',
    required: false,
    type: 'number',
    placeholder: 'Enter BPL card issue'
  },
  {
    name: 'is_bpl_certified',
    label: 'Is BPL Certified?',
    required: true,
    select: true,
    options: yesNoOptions
  },
  {
    name: 'bpl_certification_authority',
    label: 'BPL Certification Authority',
    required: false,
    type: 'text',
    placeholder: 'Enter BPL certification authority'
  },
  {
    name: 'bpl_other_certifying_authority',
    label: 'Other Certifying Authority',
    required: false,
    type: 'text',
    placeholder: 'Enter other certifying authority'
  },
  {
    name: 'bpl_certificate_issue_date',
    label: 'BPL Certificate Issue Date',
    required: false,
    type: 'date',
    placeholder: 'Select BPL certificate issue date'
  }
];
