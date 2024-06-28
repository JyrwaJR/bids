'use client';
import React from 'react';

import { Button } from '@src/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { ScrollArea } from '@components/ui/scroll-area';
import { CalendarDateRangePicker } from '@components/date-range-picker';
import { CenterDomainPage } from './domain';
import { CenterPageComponents } from './center';

export const CentrePage = () => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="items-center hidden space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="domain">Add Domain to center</TabsTrigger>
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
