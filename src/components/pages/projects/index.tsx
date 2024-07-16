import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { ProjectColumn } from '@constants/columns';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { useAuthContext } from '@context/auth';
import AddNewProject from './add-new-project';
import CentreProjectPage from '../centre/project';
import { axiosInstance } from '@lib/utils';
import { useQuery } from 'react-query';
import { useCQuery } from '@hooks/useCQuery';

const getProject = async (url: string) => {
  try {
    if (!url) {
      return;
    }
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
const ProjectsPage = () => {
  const { user } = useAuthContext();
  const url =
    user?.role === 'superadmin' ? 'project' : 'project-centre/get-projects';
  console.log(url);

  const { data, isFetched, isLoading, isError } = useCQuery({
    url: url,
    queryKey: ['get', 'project']
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
        <Tabs defaultValue="project" className="space-y-4">
          <TabsList>
            <TabsTrigger value="project">Project</TabsTrigger>
            {user?.role === 'superadmin' && (
              <>
                <TabsTrigger value="new-project">Add New Project</TabsTrigger>
                <TabsTrigger value="assign-project">Assign Project</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="project" className="space-y-4 ">
            <div className="flex items-start justify-between">
              <Heading title={`Projects`} description="Manage ur Staff" />
            </div>
            <Separator />
            <DataTable
              searchKey="name"
              columns={ProjectColumn}
              data={projects ?? []}
            />
          </TabsContent>
          <TabsContent value="new-project" className="space-y-4">
            <AddNewProject />
          </TabsContent>
          <TabsContent value="assign-project" className="space-y-4">
            <CentreProjectPage />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProjectsPage;
