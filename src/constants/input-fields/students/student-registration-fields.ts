import { StepType } from '@components/form/registration-stepper-form';
import { FormFieldType } from '@components/index';
import { MAX_UPLOAD_SIZE } from '@constants/index';
import { gender, SectorsOptions, yesNoOptions } from '@constants/options';
export const studentImageUploadFields: FormFieldType[] = [
  {
    name: 'ID Proof',
    label: 'ID Proof',
    required: true,
    type: 'file'
  },
  {
    name: 'Residence Proof',
    label: 'Residence Proof',
    required: true,
    type: 'file'
  },
  {
    name: 'Age Proof',
    label: 'Age Proof',
    required: true,
    type: 'file'
  },
  {
    name: 'Education Qualification Proof',
    label: 'Education Qualification Proof',
    required: true,
    type: 'file'
  },
  {
    name: 'BPL Proof',
    label: 'BPL Proof',
    required: true,
    type: 'file'
  },
  {
    name: 'Proof of Caste',
    label: 'Proof of Caste',
    type: 'file'
  },
  {
    name: 'Proof of Disability',
    label: 'Proof of Disability',
    type: 'file'
  },
  {
    name: 'Exceptional Proof',
    label: 'Exceptional Proof',
    type: 'file'
  }
];

export const startStudentRegistrationFields: FormFieldType[] = [
  {
    name: 'first_name',
    label: 'First Name',
    required: true,
    type: 'text',
    placeholder: 'Enter First Name'
  },
  {
    name: 'middle_name',
    label: 'Middle Name',
    required: false,
    type: 'text',
    placeholder: 'Enter Middle Name'
  },
  {
    name: 'last_name',
    label: 'Last Name',
    required: true,
    type: 'text',
    placeholder: 'Enter Last Name'
  },
  {
    name: 'mobile',
    label: 'Mobile',
    required: true,
    placeholder: 'Enter Mobile'
  },
  {
    name: 'dob',
    label: 'Date of Birth',
    required: true,
    type: 'date'
  }
];
const studentRegistrationDomain: FormFieldType[] = [
  {
    name: 'project_id',
    label: 'Project',
    required: true,
    select: true
  },
  {
    name: 'batch_id',
    label: 'Batch',
    required: true,
    type: 'text',
    select: true
  },
  {
    name: 'domain_id',
    label: 'Apply Domain',
    required: true,
    type: 'text',
    select: true
  }
];
const studentRegistrationPersonalDetailsFields: FormFieldType[] = [
  {
    name: 'first_name',
    label: 'First Name',
    required: true,
    type: 'text',
    placeholder: 'Enter First Name'
  },
  {
    name: 'middle_name',
    label: 'Middle Name',
    required: false,
    type: 'text',
    placeholder: 'Enter Middle Name'
  },
  {
    name: 'last_name',
    label: 'Last Name',
    required: true,
    type: 'text',
    placeholder: 'Enter Last Name'
  },
  {
    name: 'dob',
    label: 'Date of Birth',
    required: true,
    type: 'date'
  },
  {
    name: 'email',
    label: 'Email',
    required: false,
    type: 'email',
    placeholder: 'Enter Email'
  },
  {
    name: 'aadhaar',
    label: 'Aadhaar',
    required: false,
    type: 'string',
    placeholder: 'Enter Adhaar',
    helperText: 'Enter 12 digit Adhaar number'
  },

  {
    name: 'gender',
    label: 'Gender',
    required: true,
    options: gender,
    select: true
  },
  {
    name: 'category',
    label: 'Category',
    required: true,
    type: 'text',
    select: true
  },
  {
    name: 'religion',
    label: 'Religion',
    required: true,
    select: true,
    placeholder: 'Enter Religion'
  },
  {
    name: 'marital_status',
    label: 'Marital Status',
    required: true,
    placeholder: 'Enter Marital Status',
    select: true,
    options: yesNoOptions
  },
  {
    name: 'education',
    label: 'Education',
    required: true,
    select: true
  },
  {
    name: 'mobilisation_source',
    label: 'Mobilisation Source',
    required: false,
    type: 'text',
    placeholder: 'Enter Mobilisation Source'
  },
  {
    name: 'remarks',
    label: 'Remarks',
    required: false,
    type: 'text',
    placeholder: 'Enter Remarks'
  },
  {
    name: 'passport',
    label: 'Passport',
    required: false,
    type: 'file',
    placeholder: 'Enter Passport',
    helperText: `file size < ${MAX_UPLOAD_SIZE / 1024 / 1024} MB`
  }
];
const studentRegistrationPresentAddressFields: FormFieldType[] = [
  {
    name: 'resident_type',
    label: 'Resident Type',
    required: false,
    select: true,
    options: SectorsOptions
  },
  {
    name: 'landmark',
    label: 'Landmark',
    required: false,
    type: 'text',
    placeholder: 'Enter Landmark'
  },
  {
    name: 'present_address',
    label: 'Present Address',
    required: false,
    type: 'text',
    placeholder: 'Enter Present Address'
  },
  {
    name: 'village',
    label: 'Village',
    required: false,
    type: 'text',
    placeholder: 'Enter Village'
  },
  {
    name: 'panchayat',
    label: 'Panchayat',
    required: false,
    type: 'text',
    placeholder: 'Enter Panchayat'
  },
  {
    name: 'block',
    label: 'Block',
    required: false,
    type: 'text',
    placeholder: 'Enter Block'
  },
  {
    name: 'police_station',
    label: 'Police Station',
    required: false,
    type: 'text',
    placeholder: 'Enter Police Station'
  },
  {
    name: 'post_office',
    label: 'Post Office',
    required: false,
    type: 'text',
    placeholder: 'Enter Post Office'
  },
  {
    name: 'district',
    label: 'District',
    required: false
  },
  {
    name: 'state',
    label: 'State',
    required: false,
    select: true
  },
  {
    name: 'pin_code',
    label: 'Pin Code',
    required: false,
    type: 'string',
    placeholder: 'Enter Pin Code'
  }
];

const studentRegistrationPermanentsAddressDetailFields: FormFieldType[] = [
  {
    name: 'p_address',
    label: 'Permanent Address',
    required: false,
    type: 'text',
    placeholder: 'Enter Permanent Address'
  },
  {
    name: 'p_landmark',
    label: 'Permanent Landmark',
    required: false,
    type: 'text',
    placeholder: 'Enter Permanent Landmark'
  },
  {
    name: 'p_village',
    label: 'Permanent Village',
    required: false,
    type: 'text',
    placeholder: 'Enter Permanent Village'
  },
  {
    name: 'p_panchayat',
    label: 'Permanent Panchayat',
    required: false,
    type: 'text',
    placeholder: 'Enter Permanent Panchayat'
  },
  {
    name: 'p_block',
    label: 'Permanent Block',
    required: false,
    type: 'text',
    placeholder: 'Enter Permanent Block'
  },
  {
    name: 'p_police_station',
    label: 'Permanent Police Station',
    required: false,
    type: 'text',
    placeholder: 'Enter Permanent Police Station'
  },
  {
    name: 'p_post_office',
    label: 'Permanent Post Office',
    required: false,
    type: 'text',
    placeholder: 'Enter Permanent Post Office'
  },
  {
    name: 'p_district',
    label: 'Permanent District',
    required: false,
    placeholder: 'Enter Permanent District'
  },
  {
    name: 'p_state',
    label: 'Permanent State',
    required: false,
    select: true
  },
  {
    name: 'p_pin_code',
    label: 'Permanent Pin Code',
    required: false,
    type: 'number',
    placeholder: 'Enter Permanent Pin Code'
  }
];

const studentRegistrationParentDetailFields: FormFieldType[] = [
  {
    name: 'father_name',
    label: 'Father Name',
    required: false,
    type: 'text',
    placeholder: 'Enter Father Name'
  },
  {
    name: 'father_last_name',
    label: 'Father Last Name',
    required: false,
    type: 'text',
    placeholder: 'Enter Father Last Name'
  },
  {
    name: 'father_mobile',
    label: 'Father Mobile',
    required: false,
    placeholder: 'Enter Father Mobile'
  },
  {
    name: 'father_age',
    label: 'Father Age',
    required: false,
    type: 'number',
    placeholder: 'Enter Father Age'
  },
  {
    name: 'father_occupation',
    label: 'Father Occupation',
    required: false,
    type: 'text',
    placeholder: 'Enter Father Occupation'
  },
  {
    name: 'father_income',
    label: 'Father Income',
    required: false,
    type: 'number',
    placeholder: 'Enter Father Income'
  },
  {
    name: 'mother_name',
    label: 'Mother Name',
    required: false,
    type: 'text',
    placeholder: 'Enter Mother Name'
  },
  {
    name: 'mother_last_name',
    label: 'Mother Last Name',
    required: false,
    type: 'text',
    placeholder: 'Enter Mother Last Name'
  },
  {
    name: 'mother_mobile',
    label: 'Mother Mobile',
    required: false,
    placeholder: 'Enter Mother Mobile'
  },
  {
    name: 'mother_age',
    label: 'Mother Age',
    required: false,
    type: 'number',
    placeholder: 'Enter Mother Age'
  },
  {
    name: 'mother_occupation',
    label: 'Mother Occupation',
    required: false,
    type: 'text',
    placeholder: 'Enter Mother Occupation'
  },
  {
    name: 'mother_income',
    label: 'Mother Income',
    required: false,
    type: 'number',
    placeholder: 'Enter Mother Income'
  },
  {
    name: 'head_of_family',
    label: 'Head of Family',
    required: false,
    placeholder: 'Enter Head of Family',
    select: true,
    options: yesNoOptions
  }
];

export const studentRegistrationFields: StepType[] = [
  {
    name: 'Personal Information',
    id: 'Personal Information',
    fields: studentRegistrationPersonalDetailsFields
  },
  {
    name: 'Parent Details',
    id: 'Parental Details',
    fields: studentRegistrationParentDetailFields
  },
  {
    name: 'Address',
    id: 'Address',
    fields: [
      ...studentRegistrationPresentAddressFields,
      ...studentRegistrationPermanentsAddressDetailFields
    ]
  },
];
