import { Card } from '@components/ui/card';
import { ScreenHeight } from '@src/constants';
import React from 'react';
import { Typography } from '@src/components/typography';

interface Props {}
export const DashBoard = ({}: Props) => {
  return (
    <Card className={`h-${ScreenHeight} flex items-center justify-center`}>
      <div>
        <Typography size={'h1'}>Dashboard</Typography>
      </div>
    </Card>
  );
};
