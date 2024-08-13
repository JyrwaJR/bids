'use client';
import { AttendancePage } from '@components/pages/attendance';
import React, { Suspense } from 'react';

export default function page() {
  return (
    <Suspense>
      <AttendancePage />
    </Suspense>
  );
}
