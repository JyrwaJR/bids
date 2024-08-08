export interface DomainDetailsType {
  registration_id: string;
  batch_id: string;
  project_id: string;
  domain_id: string[];
}
export interface PersonalDetailsType {
  registration_date: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  email: string;
  aadhaar: string;
  gender: string;
  category: string;
  mobile: string;
  religion: string;
  marital_status: string;
  education: string;
  mobilisation_source: string;
  remarks: string;
}
export interface BplDetailsType {
  bpl_card_no: string;
  bpl_card_issue: string | number;
  is_bpl_certified: string;
  bpl_certification_authority?: string | undefined | null;
  bpl_other_certifying_authority?: string | undefined | null;
  bpl_certificate_issue_date?: string | Date | undefined | null;
}
export interface AddressDetailsType {
  resident_interface?: string;
  landmark?: string;
  present_address?: string;
  village?: string;
  panchayat?: string;
  block?: string;
  police_station?: string;
  post_office?: string;
  district?: string;
  pin_code?: string;
  p_landmark?: string;
  p_village?: string;
  p_panchayat?: string;
  p_block?: string;
  p_police_station?: string;
  p_post_office?: string;
  p_district?: string;
  p_pin_code?: string;
}
export interface FamilyDetailsType {
  father_name?: string;
  father_last_name?: string;
  father_mobile?: string | number | null | undefined;
  father_age?: string | number;
  father_occupation?: string;
  father_income?: string | number | null | undefined;
  mother_name?: string;
  mother_last_name?: string;
  mother_mobile?: string | number | null | undefined;
  mother_age?: string | number;
  mother_occupation?: string;
  mother_income?: string | number | null | undefined;
  head_of_family?: string;
}
export interface startRegisDetailType {
  first_name: string;
  middle_name?: string | null | undefined;
  last_name: string;
  dob: string;
}
