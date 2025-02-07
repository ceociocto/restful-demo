import { useMemo } from 'react';

export const useFlowNavigation = (steps: string[], currentStep: string) => {
  return useMemo(() => {
    const currentIndex = steps.indexOf(currentStep);
    
    return {
      canGoNext: currentIndex < steps.length - 1,
      canGoPrevious: currentIndex > 0,
      goToNextStep: () => steps[currentIndex + 1],
      goToPreviousStep: () => steps[currentIndex - 1],
      isFirstStep: currentIndex === 0,
      isLastStep: currentIndex === steps.length - 1,
      totalSteps: steps.length,
      currentStepNumber: currentIndex + 1
    };
  }, [steps, currentStep]);
}; 