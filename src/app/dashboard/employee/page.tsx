import { Plus } from 'lucide-react';
import Link from 'next/link';
import BreadCrumb from '@src/components/breadcrumb';
import { buttonVariants } from '@src/components/ui/button';
import { Separator } from '@src/components/ui/separator';
import { cn } from '@src/lib/utils';

const breadcrumbItems = [{ title: 'Employee', link: '/dashboard/employee' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Link
            href={'/dashboard/employee/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Link>
        </div>
        <Separator />

        {/* <EmployeeTable
          searchKey="country"
          columns={columns}
          totalUsers={totalUsers}
          data={employee}
          pageCount={pageCount}
        /> */}
      </div>
    </>
  );
}
