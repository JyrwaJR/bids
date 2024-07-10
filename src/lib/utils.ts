import axios from 'axios';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    // get token from cookies
    'Content-Type': 'application/json'
  }
});
