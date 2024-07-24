import { Form } from '@components/index'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { showToast } from '@components/ui/show-toast'
import { eventManagementFields } from '@constants/input-fields'
import { eventsManagementQueryKey } from '@constants/query-keys'
import { FailedToastTitle } from '@constants/toast-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCMutation } from '@hooks/useCMutation'
import { EventManagementModel, EventManagementModelType } from '@models/events-management-model'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
type Props = {
  open: boolean;
  onClose: () => void
}
const AddEventsManagement = ({ open, onClose, }: Props) => {
  const form = useForm<EventManagementModelType>({
    resolver: zodResolver(EventManagementModel)
  })
  const { isLoading, mutateAsync } = useCMutation({
    url: 'events/save',
    method: "POST",
    queryKey: eventsManagementQueryKey
  })
  const onSubmit: SubmitHandler<EventManagementModelType> = async (data) => {
    try {
      const response = await mutateAsync(data)
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
  return (
    <Dialog
      open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Events Management
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

export default AddEventsManagement
