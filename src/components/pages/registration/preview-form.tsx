import { Typography } from '@components/index';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { StudentRegistrationModelWithDomainType } from '@src/app/dashboard/registration/_lib/function';
import { StepsFieldFormT } from '@src/types';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import jsPDF from 'jspdf';
type Props = {
  form: UseFormReturn<StudentRegistrationModelWithDomainType>;
  fields: StepsFieldFormT[];
};
export const PreviewForm = ({ form, fields }: Props) => {
 
  return (
    <div className="space-y-5">
      {fields.map((field, i) => (
        <Card key={i} className="flex flex-col space-y-4 px-5 py-2">
          <Typography size={'h3'} colors={'primary'} weight={'bold'}>
            {field.name}
          </Typography>
          <div className="grid grid-cols-3 gap-4 py-4">
            {field.fields.map((item, i) => (
              <div className="col-span-1 flex gap-4" key={i}>
                <div>
                  <Typography>{item.label}</Typography>
                </div>
                <div>
                  <Typography className="text-muted-foreground">:</Typography>
                </div>
                <div>
                  <Typography>
                    {
                      form.getValues()[
                        item.name as keyof StudentRegistrationModelWithDomainType
                      ] as string
                    }
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
