import { FormFieldType } from '@components/index';

export const studentSupportiveDocumentFormFields: FormFieldType[] = [
  {
    name: 'registration_id',
    label: 'Registration ID',
    required: true,
    type: 'text',
    placeholder: 'Enter Registration ID'
  },
  {
    name: 'centre_id',
    label: 'Centre ID',
    required: true,
    type: 'text',
    placeholder: 'Enter Centre ID'
  },
  {
    name: 'domain_id',
    label: 'Domain ID',
    required: true,
    type: 'text',
    placeholder: 'Enter Domain ID'
  },
  {
    name: 'project_id',
    label: 'Project ID',
    required: true,
    type: 'text',
    placeholder: 'Enter Project ID'
  },
  {
    name: 'id_proof',
    label: 'ID Proof',
    required: false,
    type: 'text',
    placeholder: 'Enter ID Proof'
  },
  {
    name: 'id_proof_document',
    label: 'ID Proof Document',
    required: false,
    type: 'file',
    placeholder: 'Enter ID Proof Document'
  },
  {
    name: 'residence_proof',
    label: 'Residence Proof',
    required: false,
    type: 'text',
    // TODO
    placeholder: 'Enter Residence Proof'
  },
  {
    name: 'residence_proof_document',
    label: 'Residence Proof Document',
    required: false,
    type: 'file',
    placeholder: 'Enter Residence Proof Document'
  },
  {
    name: 'age_proof',
    label: 'Age Proof',
    required: false,
    type: 'text',
    // TODO change to select
    placeholder: 'Enter Age Proof'
  },
  {
    name: 'age_proof_document',
    label: 'Age Proof Document',
    required: false,
    type: 'file',
    placeholder: 'Enter Age Proof Document'
  },
  {
    name: 'caste_proof',
    label: 'Caste Proof',
    required: false,
    type: 'text',
    // TODO change to select
    placeholder: 'Enter Caste Proof'
  },
  {
    name: 'pwd_proof',
    label: 'PWD Proof',
    required: false,
    type: 'file',
    // TODO change to select
    placeholder: 'Enter PWD Proof'
  },
  {
    name: 'education_proof',
    label: 'Education Proof',
    required: false,
    type: 'file',
    // TODO change to select
    placeholder: 'Enter Education Proof'
  },
  {
    name: 'bpl_income_proof',
    label: 'BPL Income Proof',
    required: false,
    type: 'file',
    // TODO change to select
    placeholder: 'Enter BPL Income Proof'
  },
  {
    name: 'exception_approval_document',
    label: 'Exception Approval Document',
    required: false,
    type: 'file',
    placeholder: 'Enter Exception Approval Document'
  }
];
