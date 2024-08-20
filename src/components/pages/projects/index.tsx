import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { ProjectColumn } from '@constants/columns';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { useAuthContext } from '@context/auth';
import AddNewProject from './add-new-project';
import CentreProjectPage from '../centre/project';
import { useCQuery } from '@hooks/useCQuery';
import { projectsQueryKey } from '@constants/query-keys';

const ProjectsPage = () => {
  const { user } = useAuthContext();
  const url =
    user?.role === 'superadmin' ? 'project' : 'project-centre/get-projects';
  const { data, isFetched, isLoading, isError } = useCQuery({
    url: url,
    queryKey: projectsQueryKey
  });

  const projects =
    !isError &&
    isFetched &&
    !isLoading &&
    data.data &&
    user?.role === 'superadmin'
      ? data?.data
      : data?.data.map((item: any) => item.project);

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Projects`} description="Manage Staff" />
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={ProjectColumn}
          data={projects ?? []}
        />
      </div>
    </>
  );
};

export default ProjectsPage;
