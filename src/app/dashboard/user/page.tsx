import BreadCrumb from '@src/components/breadcrumb';
import { UserClient } from '@src/components/tables/user-tables/client';

const breadcrumbItems = [{ title: 'User', link: '/dashboard/user' }];
export default function page() {
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={[]} />
      </div>
    </>
  );
}
