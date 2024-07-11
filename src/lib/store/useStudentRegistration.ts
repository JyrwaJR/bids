import { StudentRegistrationModelType } from '@models/student';
import { create } from 'zustand';

interface RegisterType {
  isOpen: boolean;
  isUpdate: boolean;
  id?: string;
  onOpen: () => void;
  onClose: () => void;
  onUpdate: () => void;
  onRegister: () => void;
  setId: (id: string) => void;
  data?: StudentRegistrationModelType;
  setData: (data: StudentRegistrationModelType) => void;
}

const emptyDefaultStudentRegistrationData: StudentRegistrationModelType = {
  registration_date: '',
  aadhaar: null,
  first_name: '',
  middle_name: null,
  last_name: '',
  dob: '',
  gender: '',
  category: 'ST',
  mobile: '',
  email: null,
  religion: '',
  marital_status: 'Unmarried',
  education: '',
  mobilisation_source: null,
  remarks: null,
  father_name: null,
  father_last_name: null,
  father_mobile: null,
  father_age: null,
  father_occupation: null,
  father_income: null,
  mother_name: null,
  mother_last_name: null,
  mother_mobile: null,
  mother_age: null,
  mother_occupation: null,
  mother_income: null,
  head_of_family: null,
  resident_type: 'Rural',
  landmark: null,
  present_address: null,
  village: null,
  panchayat: null,
  block: null,
  police_station: null,
  post_office: null,
  district: null,
  state: null,
  pin_code: null,
  p_address: null,
  p_landmark: null,
  p_village: null,
  p_panchayat: null,
  p_block: null,
  p_police_station: null,
  p_post_office: null,
  p_district: null,
  p_state: null,
  p_pin_code: null,
  is_technical_education: 'No',
  diploma_certificate: null,
  year_passing: null,
  is_employed: 'No',
  occupation: null,
  year_experience: null,
  monthly_income: null,
  is_bpl: 'No',
  bpl_card_no: null,
  bpl_card_issue: null,
  is_bpl_certified: 'No',
  bpl_certification_authority: null,
  bpl_other_certifying_authority: null,
  bpl_certificate_issue_date: null,
  hostel_required: 'No',
  will_migrate: 'No',
  is_minority: 'No',
  is_disabled: 'No',
  disability_type: null,
  family_size: null,
  catchment_area: 'No',
  nre_job_card_no: null,
  mgnrega_hours_worked: null,
  status: 'Applied'
};

export const useRegisterStudent = create<RegisterType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  isUpdate: false,
  onUpdate: () => set({ isUpdate: true }),
  onRegister: () => set({ isUpdate: false }),
  setId: (id: string) => set({ id }),
  setData: (data: StudentRegistrationModelType) => set({ data }),
  id: '',
  data: emptyDefaultStudentRegistrationData
}));
