'use client';
import { useSearchParams } from 'next/navigation';
export default function page() {
  const searchId = useSearchParams().get('id');
  return <div>{searchId}</div>;
}
