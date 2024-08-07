'use client';
import { SearchPage } from '@components/pages/search';
import React, { Suspense } from 'react';

export default function page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
