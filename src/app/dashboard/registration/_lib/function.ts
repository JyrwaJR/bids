import axios from 'axios';
import {
  AddressDetailsType,
  FamilyDetailsType,
  PersonalDetailsType,
  startRegisDetailType
} from './type';

export const addFamilyDetails = async (
  token: string,
  isRegistrationId: string,
  data: FamilyDetailsType
) => {
  try {
    if (!isRegistrationId || !token) {
      return;
    }
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/registration/add-family-details/${isRegistrationId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during add personal details:', error);
    throw error;
  }
};
export const addAddressDetails = async (
  token: string,
  isRegistrationId: string,
  data: AddressDetailsType
) => {
  try {
    if (!isRegistrationId || !token) {
      return;
    }
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/registration/add-address-details/${isRegistrationId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during add personal details:', error);
    throw error;
  }
};
export const addPersonalDetails = async (
  token: string,
  isRegistrationId: string,
  data: PersonalDetailsType
) => {
  try {
    if (!isRegistrationId || !token) {
      return;
    }
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/registration/add-personal-details/${isRegistrationId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during add personal details:', error);
    throw error;
  }
};

export const startRegistration = async (
  token: string,
  data: startRegisDetailType
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/registration/start-registration`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data; // Assuming response.data contains the necessary registration ID
  } catch (error) {
    console.error('Error during start registration:', error);
    throw error;
  }
};
