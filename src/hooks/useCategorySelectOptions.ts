import { OptionsT } from '@components/form/type';
import { useCallback, useEffect, useState } from 'react';
import { useCQuery } from './useCQuery';

type CategoryOptionsT = {
  categories: OptionsT[];
  disabilities: OptionsT[];
  maritalStatus: OptionsT[];
  qualifications: OptionsT[];
  religions: OptionsT[];
  district: OptionsT[];
  states: OptionsT[];
};
export const defaultOptions: CategoryOptionsT = {
  categories: [],
  disabilities: [],
  maritalStatus: [],
  qualifications: [],
  religions: [],
  states: [],
  district: []
};
export function useCategorySelectOptions() {
  const [options, setOptions] = useState<CategoryOptionsT>(defaultOptions);
  const { data, isError, isFetched, isLoading } = useCQuery({
    url: 'registration/get-drop-down-list',
    queryKey: ['categories']
  });

  const { data: state, isFetched: isStateFetched } = useCQuery({
    url: 'state',
    queryKey: ['state']
  });
  const { data: district, isFetched: isDistrictFetched } = useCQuery({
    url: 'district',
    queryKey: ['district', 'get district']
  });

  const districtOptions = useCallback(() => {
    if (isDistrictFetched && district) {
      return district.data.map((item: { name: string }) => ({
        value: item.name,
        label: item.name
      }));
    }
    return [];
  }, [district, isDistrictFetched]);

  const stateOptions = useCallback(() => {
    if (isStateFetched && state) {
      return state.data.map((item: { name: string }) => ({
        value: item.name,
        label: item.name
      }));
    }
    return [];
  }, [isStateFetched, state]);

  useEffect(() => {
    if (isFetched && !isError && data?.data) {
      const transformToOptions = (items: string[]): OptionsT[] =>
        items.map((item) => ({
          value: item,
          label: item
        }));
      setOptions({
        categories: transformToOptions(data.data.categories),
        disabilities: transformToOptions(data.data.disabilities),
        maritalStatus: transformToOptions(data.data.maritalStatus),
        qualifications: transformToOptions(data.data.qualifications),
        religions: transformToOptions(data.data.religions),
        states: stateOptions(),
        district: districtOptions()
      });
    }
  }, [isFetched, isError, data, districtOptions, stateOptions]);

  useEffect(() => {
    if (isError) {
      setOptions(defaultOptions);
    }
  }, [isError]);

  return {
    options,
    isLoading,
    isError,
    isFetched
  };
}
