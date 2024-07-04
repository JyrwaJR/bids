'use client';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import CenterDomainPage from './domain';
import { CenterPageComponents } from './center';
import CentreProjectPage from './project';

const CentrePage = () => {
  return (
    <div className="flex-1 space-y-4">
      <Tabs defaultValue="centre">
        <TabsList>
          <TabsTrigger value="centre">Centre</TabsTrigger>
          <TabsTrigger value="domain">Centre Domain</TabsTrigger>
          <TabsTrigger value="project">Centre Project</TabsTrigger>
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
  );
};
export default CentrePage;
