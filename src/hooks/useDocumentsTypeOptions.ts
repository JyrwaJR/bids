import { OptionsT } from '@components/form/type';
import { useEffect, useState } from 'react';
import { useCQuery } from './useCQuery';

type DocumentOptionsT = {
  proofCategory: OptionsT[];
  idProof: OptionsT[];
  addressProof: OptionsT[];
  ageProof: OptionsT[];
};

export const defaultDocumentOptions: DocumentOptionsT = {
  proofCategory: [],
  idProof: [],
  addressProof: [],
  ageProof: []
};

export function useDocumentTypeOptions() {
  const [options, setOptions] = useState<DocumentOptionsT>(
    defaultDocumentOptions
  );

  const { data, isError, isFetched, isLoading } = useCQuery({
    url: 'registration/get-document-types',
    queryKey: ['documentTypes']
  });

  const transformToOptions = (items: string[]): OptionsT[] =>
    items.map((item) => ({
      value: item,
      label: item
    }));

  useEffect(() => {
    if (isFetched && !isError && data?.data) {
      const { data: fetchedData } = data;
      setOptions({
        proofCategory: transformToOptions(fetchedData['Proof Category']),
        idProof: transformToOptions(fetchedData['ID Proof']),
        addressProof: transformToOptions(fetchedData['Address Proof']),
        ageProof: transformToOptions(fetchedData['Age Proof'])
      });
    }
  }, [isFetched, isError, data]);

  useEffect(() => {
    if (isError) {
      setOptions(defaultDocumentOptions);
    }
  }, [isError]);

  return {
    options,
    isLoading,
    isError,
    isFetched
  };
}
