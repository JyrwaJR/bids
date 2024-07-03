import { ReactElement, useCallback, useState } from 'react';
type props = {
  steps: ReactElement[];
  onTrigger: () => void;

};
export function useMultiStepForm({ steps, onTrigger }: props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const next = useCallback(() => {
    onTrigger();
   setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length, onTrigger,]);

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
