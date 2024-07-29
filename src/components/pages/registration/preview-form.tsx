import { Typography } from '@components/index'
import { Card } from '@components/ui/card'
import { studentRegistrationFields } from '@constants/input-fields/students'
import { StudentRegistrationModelWithDomainType } from '@src/app/dashboard/registration/_lib/function'
import { useRegistrationFields } from '@src/app/dashboard/registration/_lib/useRegistrationFields'
import { StepsFieldFormT } from '@src/types'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  form: UseFormReturn<StudentRegistrationModelWithDomainType>
  fields: StepsFieldFormT[]
}
export const PreviewForm = ({
  form, fields
}: Props) => {
  console.log(form.formState)
  return (
    <div className='space-y-5'>
      {fields.map((field, i) => (
        <Card key={i} className='flex px-5 py-2 flex-col space-y-4'>
          <Typography size={'h1'} colors={'primary'} weight={'bold'}>
            {field.name}
          </Typography>
          <div className='grid py-4 grid-cols-3 gap-4'>
            {field.fields.map((item, i) => (
              <div className='col-span-1 flex gap-4' key={i}>
                <div>
                  <Typography>
                    {item.label}
                  </Typography>
                </div>
                <div>
                  <Typography className='text-muted-foreground'>
                    :
                  </Typography>
                </div>
                <div>
                  <Typography >
                    {form.getValues()[item.name as keyof StudentRegistrationModelWithDomainType] as string}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

