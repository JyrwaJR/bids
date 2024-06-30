'use client';
import React, { useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { format } from 'util';

import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@src/components/ui/calendar';
import { cn } from '@src/lib/utils';

import { Button } from '../ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { FormTag } from './form-tag';
import { FormFieldType, OptionsT } from './type';
import { ScrollArea } from '@components/ui/scroll-area';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';

type FormProps<T> = {
  onSubmit: SubmitHandler<T | any>;
  form: UseFormReturn<T | any>;
  defaultValue?: T | any;
  loading: boolean;
  fields: FormFieldType[];
  className?: string;
  btnStyle?: string;
  btnText?: string;
};
type CFormProps<T> = {
  className?: string;
  form: UseFormReturn<T | any>;
  defaultValue?: T | any;
  fields: FormFieldType[];
  loading: boolean;
};

export const CForm = <T,>({
  form,
  className,
  fields,
  defaultValue,
  loading
}: CFormProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const onClickShowPassword = () => setShowPassword(!showPassword);
  const style = cn(
    'col-span-full md:col-span-full sm:col-span-full w-full space-y-2 p-1 rounded-lg',
    className
  );
  return (
    <ScrollArea>
      <div className="grid max-h-[70vh] min-w-full grid-cols-12 gap-4 py-2 md:max-h-[90vh]">
        {!loading ? (
          <React.Fragment>
            {fields.map((input: FormFieldType, i) => (
              <div key={i} className={style}>
                <FormField
                  name={input.name}
                  control={form.control}
                  defaultValue={defaultValue?.[input.name]}
                  render={({ field }) => (
                    <div className="w-full">
                      {input.select ? (
                        <>
                          <FormItem className="w-full">
                            <FormLabel>
                              {input.label}{' '}
                              {input.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={defaultValue?.[input.name]}
                              value={field.value}
                            >
                              <FormControl className="w-full">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={'Select an option'}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <ScrollArea>
                                  {input.options?.map(
                                    (option: OptionsT, i: number) => (
                                      <React.Fragment key={i}>
                                        <SelectItem
                                          value={option.value as string}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      </React.Fragment>
                                    )
                                  )}
                                </ScrollArea>
                              </SelectContent>
                              <FormMessage />
                              <FormDescription>
                                {input.helperText}
                              </FormDescription>
                            </Select>
                          </FormItem>
                        </>
                      ) : input.type === 'dates' ? (
                        <FormItem className="flex flex-col justify-center h-full">
                          <FormLabel>
                            {input.label}{' '}
                            {input.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-[240px] pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                // disabled={(date) =>
                                //   date > new Date() ||
                                //   date < new Date("1900-01-01")
                                // }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                          <FormDescription>{input.helperText}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      ) : (
                        <React.Fragment key={i}>
                          <FormItem className="w-full">
                            <FormLabel>
                              {input.label}{' '}
                              {input.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            <Input
                              {...field}
                              className="flex"
                              placeholder={'Please enter a value'}
                              disabled={input.readOnly}
                              type={
                                input.type === 'password' && showPassword
                                  ? 'text'
                                  : input.type
                              }
                            />
                            <FormDescription>
                              {input.helperText}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        </React.Fragment>
                      )}
                    </div>
                  )}
                />
              </div>
            ))}
            <div className="flex items-center w-full h-full px-3 pb-5 col-span-full md:justify-start md:pb-0">
              {fields.find((input) => input.type === 'password') && (
                <Label className="flex h-full">
                  <Checkbox
                    checked={showPassword}
                    onCheckedChange={onClickShowPassword}
                    title="Show Password"
                  />
                  <span className="ml-2">Show Password</span>
                </Label>
              )}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {fields.map((input, i) => (
              <div key={input.name + i} className={style}>
                <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </React.Fragment>
        )}
      </div>
    </ScrollArea>
  );
};
export const Form = <T,>({
  form,
  fields,
  defaultValue,
  loading = false,
  className,
  onSubmit,
  btnStyle,
  btnText = 'Submit'
}: FormProps<T>) => {
  return (
    <FormTag
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={loading}
      btnStyle={btnStyle}
      buttonTitle={btnText}
    >
      <CForm
        fields={fields}
        defaultValue={defaultValue}
        className={className}
        loading={loading}
        form={form}
      />
    </FormTag>
  );
};
