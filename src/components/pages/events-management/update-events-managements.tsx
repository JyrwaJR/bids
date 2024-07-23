import { Form } from '@components/index'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@components/ui/dialog'
import { showToast } from '@components/ui/show-toast'
import { eventManagementFields } from '@constants/input-fields'
import { FailedToastTitle } from '@constants/toast-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCMutation } from '@hooks/useCMutation'
import { useCQuery } from '@hooks/useCQuery'
import { EventManagementModel, EventManagementModelType } from '@models/events-management-model'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  open: boolean
  onClose: () => void
  id: string
}
export const UpdateEventsManagement = ({ open, onClose, id }: Props) => {
  const form = useForm({
    resolver: zodResolver(EventManagementModel)
  })
  const { mutateAsync, isLoading } = useCMutation({
    url: `events/update/${id}`,
    method: "PUT"
  })
  const onSubmit: SubmitHandler<EventManagementModelType> = async (data) => {
    try {
      const response = await mutateAsync(data)
      console.log(response)
      if (response.success === true) {
        form.reset()
        onClose()
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message)
    }
  }

  useEffect(() => {
    const totalMen: number = form.watch('men')
    const totalWomen: number = form.watch('women')
    if (form.watch('men') && form.watch('women')) {
      form.setValue('total_participants', totalMen + totalWomen)
    }
  }, [
    form.watch('men'),
    form.watch('women')
  ])
  console.log(form.formState.errors)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update Events Management
          </DialogTitle>
          <DialogDescription>
            Please enter the following detail
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          loading={isLoading}
          fields={eventManagementFields}
          className='md:col-span-6'
          btnStyle='md:w-full'
        />
      </DialogContent>
    </Dialog>
  )
}

