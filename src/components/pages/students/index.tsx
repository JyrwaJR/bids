import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import {
  searchStudentsBy,
  studentsColumn
} from '@constants/columns/students-column';
import { Plus } from 'lucide-react';
export const StudentsPage = () => {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-start justify-between">
        <Heading title={`Students`} description="Students table" />
        <Button
          // disabled={!isFetched || !user?.role || user?.role !== 'superadmin'}
          className="text-xs md:text-sm"
          // onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        searchOptions={searchStudentsBy}
        columns={studentsColumn}
        data={[]}
      />
    </div>
  );
};
