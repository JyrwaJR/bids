'use client';
import { ReportPage } from '@components/pages';
import React, { Suspense } from 'react';

export default function page() {
  return (
    <Suspense>
      <ReportPage />
    </Suspense>
  );
}
