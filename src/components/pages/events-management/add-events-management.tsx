import { Form } from '@components/index'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { showToast } from '@components/ui/show-toast'
import { eventManagementFields } from '@constants/input-fields'
import { FailedToastTitle } from '@constants/toast-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCMutation } from '@hooks/useCMutation'
import { EventManagementModel, EventManagementModelType } from '@models/events-management-model'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
type Props = {
  open: boolean;
  onClose: () => void
}
const AddEventsManagement = ({ open, onClose }: Props) => {
  const form = useForm<EventManagementModelType>({
    resolver: zodResolver(EventManagementModel)
  })
  const { isLoading } = useCMutation({
    url: 'events/save',
    method: "POST"
  })
  const onSubmit: SubmitHandler<EventManagementModelType> = async (data) => {
    try {
      // console.log(data)
      // TODO : add mutation here for event managements
    } catch (error: any) {
      showToast(FailedToastTitle, error.message)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
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
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddEventsManagement
