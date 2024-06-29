'use client';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { ScrollArea } from '@components/ui/scroll-area';
import CenterDomainPage from './domain';
import { CenterPageComponents } from './center';
import CentreProjectPage from './project';

const CentrePage = () => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Tabs defaultValue="centre" className="space-y-4">
          <TabsList>
            <TabsTrigger value="centre">Centre</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
          </TabsList>
          <TabsContent value="centre" className="space-y-4">
            <CenterPageComponents />
          </TabsContent>
          <TabsContent value="domain" className="space-y-4">
            <CenterDomainPage />
          </TabsContent>
          <TabsContent value="project" className="space-y-4">
            <CentreProjectPage />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};
export default CentrePage;
