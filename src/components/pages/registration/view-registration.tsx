import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export const ViewRegistration = () => {
  const search = useSearchParams().get('id');
  const router = useRouter();
  if (!search) {
    router.push(`/dashboard/registration/update`);
  }
  return <div>

    </div>;
};
