import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@src/components/ui/show-toast';
import { addCenterFields } from '@src/constants/input-fields';
import { FailedToastTitle } from '@src/constants/toast-message';
import { useCMutation, useCQuery } from '@src/hooks';
import { CenterModel, CenterModelType } from '@src/models';

import { Form } from '../../form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../ui/dialog';
import { FormFieldType, OptionsT } from '@components/form/type';

type Props = {
  open: boolean;
  onClose: () => void;
};
type StateT = {
  name: string;
  id: string;
};
interface DistrictT {
  id: number;
  name: string;
  state: string;
}

export const AddCentre = ({ onClose, open }: Props) => {
  const form = useForm<CenterModelType>({
    resolver: zodResolver(CenterModel)
  });
  const { isLoading, mutateAsync } = useCMutation({
    url: 'centre/save',
    method: 'POST',
    queryKey: ['add center ']
  });
  const { data, isLoading: isStateLoading } = useCQuery({
    url: 'state',
    queryKey: ['get', 'state']
  });
  const {
    data: Ddata,
    isLoading: isDiscLoading,
    isError
  } = useCQuery({
    url: 'district',
    queryKey: ['get', 'district']
  });

  const districtOption: OptionsT[] =
    !isDiscLoading &&
    !isError &&
    Ddata.data.map((item: DistrictT) => ({
      value: item.id,
      label: item.name.toString()
    }));
  const stateOptions: OptionsT[] =
    !isStateLoading &&
    data.data.map((item: StateT) => ({
      value: item.id,
      label: item.name.toString()
    }));

  const onSubmitAddCentre: SubmitHandler<CenterModelType> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };

  const fields: FormFieldType[] = [
    ...addCenterFields,
    {
      name: 'state_id',
      label: 'State',
      required: true,
      select: true,
      options: stateOptions
    },
    {
      name: 'district_id',
      label: 'District',
      required: true,
      select: true,
      options: districtOption
    }
  ];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Center</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            reprehenderit sit quisquam
          </DialogDescription>
        </DialogHeader>
        <Form
          onSubmit={onSubmitAddCentre}
          fields={fields}
          form={form}
          loading={isLoading || isStateLoading || isDiscLoading}
          btnStyle="md:w-full"
          className="w-full md:col-span-6 md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};
