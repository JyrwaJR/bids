'use client';
import PrepareAdmissionList from '@components/pages/applied-student/prepare-admission';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard/admission/applied');
  }, [router]);
  return <PrepareAdmissionList />;
};

export default Page;
