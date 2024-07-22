import { Form, FormFieldType } from '@components/index'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { showToast } from '@components/ui/show-toast'
import { FailedToastTitle } from '@constants/toast-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCMutation } from '@hooks/useCMutation'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
type Props = {
  open: boolean,
  onClose: () => void
}
const addStaffCategoryFields: FormFieldType[] = [
  {
    name: 'name',
    label: "Category Name"
  }
]
const StaffCategoryModel = z.object({
  name: z.string().min(3).trim()
})
type StaffCategoryModelType = z.infer<typeof StaffCategoryModel>
const AddStaffCategory = ({ open, onClose }: Props) => {
  const form = useForm<StaffCategoryModelType>({
    defaultValues: {
      name: ''
    },
    resolver: zodResolver(StaffCategoryModel)
  })
  const { mutate, isLoading } = useCMutation({
    url: 'staffcategory/save',
    method: 'POST',
    queryKey: ['get', 'staff', 'category']
  })
  const onSubmit: SubmitHandler<StaffCategoryModelType> = async (data) => {
    try {
      await mutate(data)
      form.reset()
      onClose()
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  }
  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Staff Category
          </DialogTitle>
          <DialogDescription>
            Please enter the name of the staff category
          </DialogDescription>
        </DialogHeader>
        <Form
          fields={addStaffCategoryFields}
          form={form}
          onSubmit={onSubmit}
          loading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddStaffCategory
