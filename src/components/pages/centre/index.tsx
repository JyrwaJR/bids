'use client';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { ScrollArea } from '@components/ui/scroll-area';
import CenterDomainPage from './domain';
import { CenterPageComponents } from './center';

const CentrePage = () => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="domain">Add Centre Domain</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <CenterPageComponents />
          </TabsContent>
          <TabsContent value="domain" className="space-y-4">
            <CenterDomainPage />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};
export default CentrePage;
