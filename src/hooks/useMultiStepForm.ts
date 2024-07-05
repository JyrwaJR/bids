import { FormFieldType } from '@components/index';
import { ReactElement, useCallback, useState } from 'react';
type props = {
  steps: ReactElement[];
  // onTrigger: () => boolean;
  fields: FormFieldType['name'] | FormFieldType['name'][];
  isValid: boolean;
};
export function useMultiStepForm({ steps, isValid }: props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const next = useCallback(async () => {
    if (!isValid) return;
    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length, isValid]);

  const back = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentStepIndex(index);
  }, []);

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back
  };
}
