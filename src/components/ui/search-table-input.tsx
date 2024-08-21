import { OptionsT } from '@components/form/type';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Input } from './input';
import { Form, FormField, FormItem, FormMessage, FormControl } from './form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from './select';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@components/ui/dropdown-menu';
import { Table } from '@src/types/common';
import { RefreshCw } from 'lucide-react';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip
} from './tooltip';
const searchSchema = z.object({
  searchTableBy: z.string().optional()
});

type searchSchmaType = z.infer<typeof searchSchema>;

export const SearchTableInput = ({
  table,
  searchOptions,
  searchTableBy,
  aBtnTitle = 'Save',
  onClick,
  disable,
  refresh
}: {
  table: Table | any;
  searchOptions?: OptionsT[];
  aBtnTitle?: string;
  searchTableBy?: string;
  onClick?: () => void;
  disable?: boolean;
  refresh?: () => void;
}) => {
  const form = useForm<searchSchmaType>({
    defaultValues: {
      searchTableBy: searchOptions?.[0].value ?? searchTableBy
    }
  });
  return (
    <>
      <div className="flex h-full w-full  items-center justify-between space-x-2">
        <div className="flex justify-between space-x-2">
          <Input
            placeholder={`Search`}
            value={
              table
                .getColumn(form.getValues('searchTableBy') ?? searchTableBy)
                ?.getFilterValue() as string
            }
            onChange={(event) =>
              table
                .getColumn(form.getValues('searchTableBy') ?? searchTableBy)
                ?.setFilterValue(event.target.value)
            }
            className="w-full md:max-w-sm"
          />
          {searchOptions && searchOptions?.length > 0 && (
            <Form {...form}>
              <FormField
                control={form.control}
                name="searchTableBy"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={searchTableBy}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={searchTableBy}
                            placeholder="Select search"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {searchOptions &&
                          searchOptions?.length > 0 &&
                          searchOptions.map((opt, i) => (
                            <SelectItem key={i} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          )}
        </div>
        <div className="flex space-x-2">
          {refresh && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size={'sm'} disabled={disable} onClick={refresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span className="hidden md:flex">Refresh</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reload</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {onClick && (
            <Button disabled={disable} onClick={onClick}>
              {aBtnTitle}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Hide
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.header}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
