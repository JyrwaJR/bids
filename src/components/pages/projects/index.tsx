import BreadCrumb from '@components/breadcrumb';
import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { Heading } from '@components/ui/heading';
import { Separator } from '@components/ui/separator';
import { domainColumn, ProjectColumn } from '@constants/columns';
import { useCQuery } from '@hooks/useCQuery';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { AddProjects } from '@components/pages';
import { ScrollArea } from '@components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';
import { DomainModelType } from '@src/models';
import { Checkbox } from '@components/ui/checkbox';
import { showToast } from '@components/ui/show-toast';
import { useAuthContext } from '@context/auth';
import { FailedToastTitle } from '@constants/toast-message';
interface ColType extends DomainModelType {
  id: string;
}
const ProjectsPage = () => {
  const { user } = useAuthContext();
  const breadcrumbItems = [{ title: 'User', link: '/dashboard/user' }];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSelectedIds, setSelectedIds] = useState<string[]>([]);
  const url =
    user?.role === 'superadmin' ? 'project' : 'project-centre/get-projects';
  const { data, isFetched } = useCQuery({
    url: url,
    queryKey: ['get', 'project']
  });
  const { data: domain, isFetched: isDomainFetch } = useCQuery({
    url: 'domain',
    queryKey: ['get', 'domain']
  });

  const columns: ColumnDef<ColType | any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            table.toggleAllPageRowsSelected(!!value);
            const row = table.getRowModel().rows;
            if (value) {
              setSelectedIds(row.map((row) => row.original.id));
            } else {
              setSelectedIds([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (value) {
              row.getToggleSelectedHandler()(!!value);
              setSelectedIds([...isSelectedIds, row.original.id]);
            } else {
              row.getToggleSelectedHandler()(!!value);
              setSelectedIds([
                ...isSelectedIds.filter((id) => id !== row.original.id)
              ]);
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    ...domainColumn
  ];
  const onClickAddProject = () => {
    setSelectedIds([]);

    setIsOpen(false);
    return;
  };
  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <Tabs defaultValue="centre" className="space-y-4">
            <TabsList>
              <TabsTrigger value="centre">Project</TabsTrigger>
              <TabsTrigger
                disabled={user?.role !== 'superadmin'}
                value="project"
              >
                New Project
              </TabsTrigger>
            </TabsList>
            <TabsContent value="centre" className="space-y-4">
              <BreadCrumb items={breadcrumbItems} />
              <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-start justify-between">
                  <Heading title={`Projects`} description="Manage ur project" />
                </div>
                <Separator />
                <DataTable
                  searchKey="name"
                  columns={ProjectColumn}
                  data={isFetched && data.data}
                />
              </div>
            </TabsContent>
            <TabsContent value="project" className="space-y-4">
              <div className="flex items-start justify-between">
                <Heading
                  title={`New Project`}
                  description="Please select the domain to add a project"
                />
                <Button
                  className="text-xs md:text-sm"
                  disabled={isSelectedIds.length > 0 ? false : true}
                  onClick={() => {
                    if (isSelectedIds.length > 0) {
                      setIsOpen(!isOpen);
                      return;
                    }
                    showToast(
                      FailedToastTitle,
                      'Please select domain to add to a Project'
                    );
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </div>
              <DataTable
                searchKey="name"
                columns={columns}
                data={isDomainFetch && domain.data}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {isOpen && (
        <AddProjects
          domainId={[...isSelectedIds]}
          open={isOpen}
          onClose={onClickAddProject}
        />
      )}
    </>
  );
};

export default ProjectsPage;
