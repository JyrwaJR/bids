import { axiosInstance } from '@lib/utils';
import { StudentRegistrationModel } from '@models/student/student-registration-model';
import {
  AddressDetailsType,
  BplDetailsType,
  DomainDetailsType,
  FamilyDetailsType,
  startRegisDetailType
} from './type';
import { StudentRegistrationApplyDomainModel } from '@models/student/student-registration-apply-domain-model';
import { z } from 'zod';

export async function getDomainByProjectId(projectId?: string) {
  try {
    if (!projectId) return;
    const res = await axiosInstance.get(
      `project-domain/get-domain-by-project/${projectId}`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}
export async function getBatch(projectId?: string) {
  try {
    if (!projectId) return;
    const res = await axiosInstance.get(
      `/batch/get-batch-by-centre/${projectId}`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const getStudentDataIfExist = async (id: string) => {
  try {
    if (!id) return;
    const res = await axiosInstance.get(`/registration/search-student`, {
      params: {
        search: 'Center'
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const StudentRegistrationModelWithDomain =
  StudentRegistrationModel.merge(
    StudentRegistrationApplyDomainModel
  ).superRefine((data, ctx) => {
    if (data.is_disabled === 'Yes' && data.disability_type === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Disability type is required if disabled is Yes',
        path: ['disability_type']
      });
      return false;
    } else {
      data.disability_type = data.disability_type || null;
    }
    return true;
  });
export type StudentRegistrationModelWithDomainType = z.infer<
  typeof StudentRegistrationModelWithDomain
>;
export const studentAppliedDomain = async (
  id: string,
  data: StudentRegistrationModelWithDomainType
) => {
  try {
    if (!id) {
      return;
    }

    const applyDomainPayload: DomainDetailsType = {
      registration_id: id,
      batch_id: data.batch_id,
      project_id: data.project_id,
      domain_id: [data.domain_id]
    };
    const response = await axiosInstance.post(
      `/registration/add-domain-applied`,
      applyDomainPayload
    );
    return response.data;
  } catch (error) {
    console.error('Error during add personal details:', error);
    throw error;
  }
};
export const addPersonalDetails = async (
  isRegistrationId: string,
  data: StudentRegistrationModelWithDomainType
) => {
  try {
    if (!isRegistrationId) {
      return;
    }
    const form = new FormData();
    form.append('first_name', data.first_name);
    form.append('middle_name', data.middle_name ?? '');
    form.append('last_name', data.last_name);
    form.append('dob', data.dob);
    form.append('gender', data.gender);
    form.append('marital_status', data.marital_status);
    form.append('mobilisation_source', data.mobilisation_source ?? '');
    form.append('mobile', data.mobile);
    form.append('email', data.email ?? '');
    form.append('aadhaar', data.aadhaar ?? '');
    form.append('category', data.category);
    form.append('education', data.education);
    form.append('religion', data.religion);
    form.append('remarks', data.remarks ?? '');
    form.append('registration_date', data.registration_date ?? '');
    form.append('passport', data.passport ?? '');

    const response = await axiosInstance.put(
      `/registration/add-personal-details/${isRegistrationId}`,
      form
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAddressDetails = async (
  isRegistrationId: string,
  data: StudentRegistrationModelWithDomainType
) => {
  try {
    if (!isRegistrationId) {
      return;
    }
    const addressPayload: AddressDetailsType = {
      block: data.block ?? '',
      district: data.district ?? '',
      landmark: data.landmark ?? '',
      p_block: data.p_block ?? '',
      p_district: data.p_district ?? '',
      p_landmark: data.p_landmark ?? '',
      p_pin_code: data.p_pin_code ?? '',
      p_post_office: data.p_post_office ?? '',
      p_police_station: data.p_police_station ?? '',
      p_panchayat: data.p_panchayat ?? '',
      p_village: data.p_village ?? '',
      pin_code: data.pin_code ?? '',
      post_office: data.post_office ?? '',
      police_station: data.police_station ?? '',
      present_address: data.present_address ?? '',
      village: data.village ?? ''
    };
    const response = await axiosInstance.put(
      `/registration/add-address-details/${isRegistrationId}`,
      addressPayload
    );
    return response.data;
  } catch (error) {
    console.error('Error during add personal details:', error);
    throw error;
  }
};
export const addFamilyDetails = async (
  isRegistrationId: string,
  data: StudentRegistrationModelWithDomainType
) => {
  try {
    if (!isRegistrationId) {
      return;
    }
    const familyPayload: FamilyDetailsType = {
      father_age: data.father_age ?? '',
      father_income: data.father_income ?? '',
      father_last_name: data.father_last_name ?? '',
      father_mobile: data.father_mobile ?? '',
      father_name: data.father_name ?? '',
      father_occupation: data.father_occupation ?? '',
      head_of_family: data.head_of_family ?? '',
      mother_age: data.mother_age ?? '',
      mother_income: data.mother_income ?? '',
      mother_last_name: data.mother_last_name ?? '',
      mother_mobile: data.mother_mobile ?? '',
      mother_name: data.mother_name ?? '',
      mother_occupation: data.mother_occupation ?? ''
    };
    const response = await axiosInstance.put(
      `/registration/add-family-details/${isRegistrationId}`,
      familyPayload
    );
    return response.data;
  } catch (error) {
    console.error('Error during add personal details:', error);
    throw error;
  }
};

export const otherDetails = async (
  id: string,
  data: StudentRegistrationModelWithDomainType
) => {
  try {
    if (!id) {
      return;
    }
    const response = await axiosInstance.put(
      `/registration/add-form-b-details/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addStudentBpl = async (
  id: string,
  data: StudentRegistrationModelWithDomainType
) => {
  try {
    if (!id) {
      return;
    }
    if (data.is_bpl === 'No') return;
    const payload: BplDetailsType = {
      bpl_card_no: data.bpl_card_no ?? '',
      bpl_card_issue: data.bpl_card_issue ?? '',
      is_bpl_certified: data.is_bpl_certified ?? '',
      bpl_certification_authority: data.bpl_certification_authority ?? '',
      bpl_other_certifying_authority: data.bpl_other_certifying_authority ?? '',
      bpl_certificate_issue_date: data.bpl_certificate_issue_date ?? ''
    };
    const response = await axiosInstance.post(
      `/registration/add-bpl-details/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const startRegistration = async (
  data: StudentRegistrationModelWithDomainType
) => {
  try {
    const payload: startRegisDetailType = {
      dob: data.dob,
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name
    };
    const res = await axiosInstance.post(
      '/registration/start-registration',
      payload
    );

    return {
      success: true,
      data: res.data,
      message: 'Successfully added'
    };
  } catch (error) {
    throw error;
  }
};
