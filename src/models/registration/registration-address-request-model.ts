import * as z from 'zod';

export const RegistrationAddressRequestModel = z.object({
  resident_type: z.string().max(10).nullable(),
  landmark: z.string().max(255).nullable(),
  present_address: z.string().max(255).nullable(),
  village: z.string().max(60).nullable(),
  panchayat: z.string().max(60).nullable(),
  block: z.string().max(60).nullable(),
  police_station: z.string().max(60).nullable(),
  post_office: z.string().max(60).nullable(),
  district: z.string().max(60).nullable(),
  state: z.string().max(60).nullable(),
  pin_code: z.string().max(6).nullable(),
  permanent_address: z.string().max(255).nullable(),
  p_landmark: z.string().max(255).nullable(),
  p_village: z.string().max(60).nullable(),
  p_panchayat: z.string().max(60).nullable(),
  p_block: z.string().max(60).nullable(),
  p_police_station: z.string().max(60).nullable(),
  p_post_office: z.string().max(60).nullable(),
  p_district: z.string().max(60).nullable(),
  p_state: z.string().max(60).nullable(),
  p_pin_code: z.string().max(6).nullable()
});

export type RegistrationAddressRequestType = z.infer<
  typeof RegistrationAddressRequestModel
>;
