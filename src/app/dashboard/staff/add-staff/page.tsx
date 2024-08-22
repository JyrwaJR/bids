'use client';
import { AddStaff } from '@components/pages/staff/add-staff';
import { Suspense } from 'react';

export default function page() {
  return (
    <Suspense>
      <AddStaff />
    </Suspense>
  );
}
