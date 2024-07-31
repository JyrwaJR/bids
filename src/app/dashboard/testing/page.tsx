'use client';
import { PreviewForm } from '@components/pages/registration/preview-form';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { StudentRegistrationModelWithDomainType } from '../registration/_lib/function';
import { useRegistrationFields } from '../registration/_lib/useRegistrationFields';
import jsPDF from 'jspdf';
import { Button } from '@components/ui/button';
const defaultValue = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  admission_no: '12345',
  registration_date: '2023-01-01',
  aadhaar: '123456789012',
  first_name: 'John',
  middle_name: 'Doe',
  last_name: 'Smith',
  dob: '2000-01-01',
  gender: 'Male',
  category: 'ST',
  mobile: '9876543210',
  email: 'john@example.com',
  religion: 'Christian',
  marital_status: 'Single',
  education: "Bachelor's",
  mobilisation_source: 'Internet',
  remarks: 'N/A',
  father_name: 'Robert',
  father_last_name: 'Smith',
  father_mobile: '9876543211',
  father_age: '45',
  father_occupation: 'Engineer',
  father_income: '50000',
  mother_name: 'Mary',
  mother_last_name: 'Smith',
  mother_mobile: '9876543212',
  mother_age: '42',
  mother_occupation: 'Teacher',
  head_of_family: 'Robert Smith',
  resident_type: 'Rural',
  landmark: 'Near School',
  present_address: '123 Street Name',
  village: 'Some Village',
  panchayat: 'Some Panchayat',
  block: 'Some Block',
  police_station: 'Some Police Station',
  post_office: 'Some Post Office',
  district: 'Some District',
  state: 'Some State',
  pin_code: '123456',
  p_address: '123 Permanent Address',
  p_landmark: 'Near Park',
  p_village: 'Permanent Village',
  p_panchayat: 'Permanent Panchayat',
  p_block: 'Permanent Block',
  p_police_station: 'Permanent Police Station',
  p_post_office: 'Permanent Post Office',
  p_district: 'Permanent District',
  p_state: 'Permanent State',
  p_pin_code: '654321',
  is_technical_education: 'No',
  diploma_certificate: 'N/A',
  year_passing: '2020',
  is_employed: 'No',
  occupation: 'N/A',
  year_experience: '0',
  monthly_income: '0',
  is_bpl: 'No',
  hostel_required: 'No',
  will_migrate: 'No',
  is_minority: 'No',
  is_disabled: 'No',
  disability_type: 'N/A',
  family_size: '4',
  catchment_area: 'No',
  nre_job_card_no: 'N/A',
  mgnrega_hours_worked: '0',
  status: 'Applied',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  bpl_card_no: 'N/A',
  bpl_card_issue: 2020,
  is_bpl_certified: 'No',
  bpl_certification_authority: 'N/A',
  bpl_other_certifying_authority: 'N/A',
  bpl_certificate_issue_date: '2023-01-01'
};
export default function page() {
  const reportTemplateRef = useRef(null);
  const form = useForm<StudentRegistrationModelWithDomainType>({
    defaultValues: defaultValue
  });
  const { field } = useRegistrationFields({
    form: form
  });

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: 'a4',
      unit: 'px'

    });
    // Adding the fonts.
    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save(form.getValues('first_name') + '-report');
      }
    });
  };

  return (
    <div>
      <Button onClick={handleGeneratePdf}>Generate PDF</Button>
      <div ref={reportTemplateRef} className="w-full">
        <PreviewForm
          fields={field.filter(
            (f) =>
              f.name !== 'Upload Documents' && f.name !== 'Start Registration'
          )}
          form={form}
        />
      </div>
    </div>
  );
}
