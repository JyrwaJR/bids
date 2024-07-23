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
const searchSchema = z.object({
  searchTableBy: z.string().optional()
});

type searchSchmaType = z.infer<typeof searchSchema>;

export const SearchTableInput = ({
  table,
  searchOptions,
  searchTableBy
}: {
  table?: any;
  searchOptions?: OptionsT[];
  searchTableBy?: string;
}) => {
  const form = useForm<searchSchmaType>({
    defaultValues: {
      searchTableBy: searchOptions?.[0].value ?? searchTableBy
    }
  });

  return (
    <>
      <div className="flex h-full items-center space-x-2">
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
    </>
  );
};
