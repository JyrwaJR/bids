import { OptionsT } from '@components/form/type';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCQuery } from './useCQuery';

type CategoryOptionsT = {
  categories: OptionsT[];
  disabilities: OptionsT[];
  maritalStatus: OptionsT[];
  qualifications: OptionsT[];
  religions: OptionsT[];
  district: OptionsT[];
  states: OptionsT[];
  centre: OptionsT[];
  batch: OptionsT[];
  projects: OptionsT[];
  domain: OptionsT[];
};
export const defaultOptions: CategoryOptionsT = {
  categories: [],
  disabilities: [],
  maritalStatus: [],
  qualifications: [],
  religions: [],
  states: [],
  district: [],
  centre: [],
  batch: [],
  projects: [],
  domain: []
};
type Props = {
  centreId?: string;
  projectId?: string;
};

export function useCategorySelectOptions({ centreId, projectId }: Props = {}) {
  const [options, setOptions] = useState<CategoryOptionsT>(defaultOptions);
  const { data, isError, isFetched, isLoading } = useCQuery({
    url: 'registration/get-drop-down-list',
    queryKey: ['categories']
  });

  const { data: state, isFetched: isStateFetched } = useCQuery({
    url: 'state',
    queryKey: ['state']
  });

  const { data: project, isFetched: isProjectFetched } = useCQuery({
    url: 'project',
    queryKey: ['project', 'get project']
  });
  const { data: district, isFetched: isDistrictFetched } = useCQuery({
    url: 'district',
    queryKey: ['district', 'get district']
  });
  const { data: domain, isFetched: isDomainFetched } = useCQuery({
    url: 'centre',
    queryKey: ['get', 'domain']
  });

  const { data: center, isFetched: isCenterFetched } = useCQuery({
    url: 'centre',
    queryKey: ['get', 'center', 'cate']
  });

  const domainOptions = useCallback(() => {
    if (isDomainFetched && domain) {
      return domain.data.map((domain: { name: string; id: string }) => ({
        label: domain.name,
        value: domain.id
      }));
    }
    return [];
  }, [isDomainFetched, domain]);

  const projectOptions = useCallback(() => {
    if (isProjectFetched && project) {
      return project.data.map((project: { name: string; id: string }) => ({
        label: project.name,
        value: project.id
      }));
    }
    return [];
  }, [isProjectFetched, project]);

  const centerOptions = useCallback(() => {
    if (isCenterFetched && center.success) {
      return center.data.map((center: { name: string; id: string }) => ({
        label: center.name,
        value: center.id
      }));
    }
    return [];
  }, [isCenterFetched, center]);

  const districtOptions = useCallback(() => {
    if (isDistrictFetched && district) {
      return district.data.map((item: { name: string }) => ({
        value: item.name,
        label: item.name
      }));
    }
    return [];
  }, [district, isDistrictFetched]);

  const stateOptions: OptionsT[] = useMemo(() => {
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
        states: stateOptions,
        district: districtOptions(),
        centre: centerOptions(),
        batch: [],
        projects: projectOptions(),
        domain: domainOptions()
      });
    }
  }, [
    isFetched,
    isError,
    data,
    districtOptions,
    stateOptions,
    centerOptions,
    projectOptions,
    domainOptions
  ]);
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
