'use client';
import AppliedStudentPage from '@pages/applied-student';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard/admission/applied');
  }, [router]);
  return <AppliedStudentPage />;
};

export default Page;
