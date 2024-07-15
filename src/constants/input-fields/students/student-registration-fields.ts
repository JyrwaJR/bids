import { StepType } from '@components/form/stepper-form';
import { FormFieldType } from '@components/index';
import { MAX_UPLOAD_SIZE } from '@constants/index';
import { gender, SectorsOptions, yesNoOptions } from '@constants/options';
const studentImageUploadFields: FormFieldType[] = [
  {
    name: 'ID Proof',
    label: 'ID Proof',
    required: true,
    type: 'file'
  },
  {
    name: 'Residence Proof',
    required: true,
    type: 'file'
  },
  {
    name: 'Age Proof',
    required: true
  },
  {
    name: 'Education Qualification Proof',
    required: true
  },
  {
    name: 'BPL Proof',
    required: true
  },
  {
    name: 'Proof of Caste'
  },
  {
    name: 'Proof of Disability'
  },
  {
    name: 'Exceptional Proof'
  }
];
const startStudentRegistrationFields: FormFieldType[] = [
  // {
  //   name: 'registration_date',
  //   label: 'Registration Date',
  //   required: true,
  //   type: 'date'
  // },
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
    label: 'Domain',
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
    name: 'registration_date',
    label: 'Registration Date',
    required: true,
    type: 'date'
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
    name: 'mobile',
    label: 'Mobile',
    required: true,
    type: 'text',
    placeholder: 'Enter Mobile'
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
    required: false,
    select: true
  },
  {
    name: '',
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
    placeholder: 'Enter Permanent District',
    select: true
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

// export const studentRegistrationOtherInfoFields: FormFieldType[] = [
//   {
//     name: 'is_technical_education',
//     label: 'Technical Education',
//     required: false,
//     select: true,
//     options: yesNoOptions
//   },
//   {
//     name: 'diploma_certificate',
//     label: 'Diploma Certificate',
//     required: false,
//     type: 'text',
//     // TODO : Add file upload
//     placeholder: 'Enter Diploma Certificate'
//   },
//   {
//     name: 'year_passing',
//     label: 'Year Passing',
//     required: false,
//     type: 'date',
//     placeholder: 'Enter Year Passing'
//   },
//   {
//     name: 'is_employed',
//     label: 'Employed',
//     required: false,
//     select: true,
//     options: yesNoOptions
//   },
//   {
//     name: 'occupation',
//     label: 'Occupation',
//     required: false,
//     type: 'text',
//     placeholder: 'Enter Occupation'
//   },
//   {
//     name: 'year_experience',
//     label: 'Years of Experience',
//     required: false,
//     type: 'number',
//     placeholder: 'Enter Years of Experience'
//   },
//   {
//     name: 'monthly_income',
//     label: 'Monthly Income',
//     required: false,
//     type: 'number',
//     placeholder: 'Enter Monthly Income'
//   },
//   {
//     name: 'is_bpl',
//     label: 'BPL (Below Poverty Line)',
//     required: false,
//     select: true,
//     options: yesNoOptions
//   },
//   {
//     name: 'hostel_required',
//     label: 'Hostel Required',
//     required: false,
//     select: true,
//     options: yesNoOptions
//   },
//   {
//     name: 'will_migrate',
//     label: 'Will Migrate',
//     required: false,
//     select: true,
//     options: yesNoOptions
//   },
//   {
//     name: 'is_minority',
//     label: 'Is Minority',
//     required: false,
//     select: true,
//     options: yesNoOptions
//   },
//   {
//     name: 'is_disabled',
//     label: 'Is Disabled',
//     required: false,
//     select: true,
//     options: yesNoOptions
//   },
//   {
//     name: 'disability_type',
//     label: 'Disability Type',
//     required: false,
//     select: true
//   },
//   {
//     name: 'family_size',
//     label: 'Family Size',
//     required: false,
//     type: 'number',
//     placeholder: 'Enter Family Size'
//   },
//   {
//     name: 'catchment_area',
//     label: 'Catchment Area',
//     required: false,
//     select: true,
//     options: yesNoOptions
//   },
//   {
//     name: 'nre_job_card_no',
//     label: 'NRE Job Card No',
//     required: false,
//     type: 'text',
//     placeholder: 'Enter NRE Job Card No'
//   },
//   {
//     name: 'mgnrega_hours_worked',
//     label: 'MGNREGA Hours Worked',
//     required: false,
//     type: 'number',
//     placeholder: 'Enter MGNREGA Hours Worked'
//   }
// ];
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
    type: 'number',
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
    type: 'text',
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
    type: 'text',
    placeholder: 'Enter Head of Family'
  }
];

export const studentRegistrationFields: StepType[] = [
  {
    name: 'Start Registration',
    id: 'Start Registration',
    fields: startStudentRegistrationFields
  },
  {
    name: 'Personal Information',
    id: 'Personal Information',
    fields: studentRegistrationPersonalDetailsFields
  },
  {
    name: 'Parental Details',
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
  {
    name: 'Apply Domain',
    id: 'Apply Domain',
    fields: studentRegistrationDomain
  },
  {
    name: 'Upload Documents',
    id: 'Upload Documents',
    fields: studentImageUploadFields
  }
];
