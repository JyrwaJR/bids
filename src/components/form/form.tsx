'use client';
import React, { useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { FormTag } from './form-tag';
import { FormFieldType, OptionsT } from './type';
import { ScrollArea } from '@components/ui/scroll-area';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';
import { format, parse } from 'date-fns';
import { Textarea } from '@components/ui/textarea';

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
  disabled?: boolean;
};

export const CForm = <T,>({
  form,
  className,
  fields,
  defaultValue,
  loading,
  disabled
}: CFormProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const onClickShowPassword = () => setShowPassword(!showPassword);
  const style = cn('col-span-full w-full space-y-2 p-1 rounded-lg', className);
  return (
    <ScrollArea>
      <div className="grid max-h-[75vh] min-w-full grid-cols-12 gap-2  py-2">
        {!loading ? (
          <React.Fragment>
            {fields.map((input: FormFieldType, i) => (
              <div key={i} className={style}>
                <FormField
                  name={input.name}
                  control={form.control}
                  defaultValue={defaultValue?.[input.name]}
                  disabled={disabled}
                  render={({
                    field,
                    field: { ref, name, onBlur, onChange }
                  }) => (
                    <div className="w-full">
                      {input.select ? (
                        <>
                          <FormItem className="w-full">
                            <FormLabel htmlFor={input.name}>
                              {input.label}{' '}
                              {input.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl className="w-full">
                                <SelectTrigger
                                  disabled={disabled || input.readOnly}
                                >
                                  <SelectValue
                                    defaultValue={field.value}
                                    placeholder={
                                      input.placeholder ??
                                      `Select ${input.label}`
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>{input.label}</SelectLabel>
                                  {input.options?.map(
                                    (option: OptionsT, i: number) => (
                                      <React.Fragment key={i}>
                                        <SelectItem
                                          className="cursor-pointer "
                                          value={option.value as string}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      </React.Fragment>
                                    )
                                  )}
                                </SelectGroup>
                              </SelectContent>
                              <FormMessage />
                              <FormDescription>
                                {input.helperText}
                              </FormDescription>
                            </Select>
                          </FormItem>
                        </>
                      ) : input.type === 'dates' ? (
                        <FormItem className="flex h-full flex-col justify-center">
                          <FormLabel>{input.label}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    typeof field.value === 'string' &&
                                    field.value.includes('/') ? (
                                      format(
                                        parse(
                                          field.value,
                                          'dd/MM/yyyy',
                                          new Date()
                                        ),
                                        'yyyy-MM-dd'
                                      )
                                    ) : (
                                      format(field.value, 'yyyy-MM-dd')
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Your date of birth is used to calculate your age.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      ) : input.type === 'file' ? (
                        <React.Fragment key={i}>
                          <FormItem className="w-full">
                            <FormLabel htmlFor={input.name}>
                              {input.label}{' '}
                              {input.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            {/* check if value is null or undefined or ""  */}

                            <Input
                              type="file"
                              className="flex"
                              disabled={disabled || input.readOnly}
                              ref={ref}
                              autoFocus={i === 0}
                              name={name}
                              accept={input.accept ?? 'image/*'}
                              onBlur={onBlur}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && file instanceof File) {
                                  // Optionally, add more file validation if needed (e.g., file type, size)
                                  onChange(file);
                                } else {
                                  // Return null or handle invalid file case
                                  onChange(null);
                                }
                              }}
                            />
                            <FormDescription>
                              {input.helperText}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        </React.Fragment>
                      ) : input.type === 'textarea' ? (
                        <React.Fragment key={i}>
                          <FormItem className="w-full">
                            <FormLabel htmlFor={input.name}>
                              {input.label}{' '}
                              {input.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            <Textarea
                              {...field}
                              className="flex"
                              placeholder={
                                input.placeholder ??
                                `Please enter ${input.label}`
                              }
                              disabled={input.readOnly || disabled}
                            />
                            <FormDescription>
                              {input.helperText}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        </React.Fragment>
                      ) : input.type === 'date' ? (
                        <React.Fragment key={i}>
                          <FormItem className="w-full">
                            <FormLabel htmlFor={input.name}>
                              {input.label}{' '}
                              {input.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            <Input
                              {...field}
                              type="date"
                              value={
                                typeof field.value === 'string' &&
                                field.value.includes('/')
                                  ? format(
                                      parse(
                                        field.value,
                                        'dd/MM/yyyy',
                                        new Date()
                                      ),
                                      'yyyy-MM-dd'
                                    )
                                  : field.value
                              }
                              className="flex"
                              placeholder={
                                input.placeholder ??
                                `Please enter ${input.label}`
                              }
                              disabled={input.readOnly || disabled}
                              onChange={(e) => {
                                const value =
                                  input.type === 'number'
                                    ? Number(e.target.value)
                                    : e.target.value;
                                onChange(value);
                              }}
                            />
                            <FormDescription>
                              {input.helperText}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={i}>
                          <FormItem className="w-full">
                            <FormLabel htmlFor={input.name}>
                              {input.label}{' '}
                              {input.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            <Input
                              {...field}
                              className="flex"
                              placeholder={
                                input.placeholder ??
                                `Please enter ${input.label}`
                              }
                              disabled={input.readOnly || disabled}
                              onChange={(e) => {
                                const value =
                                  input.type === 'number'
                                    ? Number(e.target.value)
                                    : e.target.value;
                                onChange(value);
                              }}
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
            <div className="col-span-full flex h-full w-full items-center px-3 pb-5 md:justify-start md:pb-0">
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
                <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
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
