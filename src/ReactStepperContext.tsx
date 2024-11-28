import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

// Create the context with an empty default value
const StepperContext = createContext<ReactStepperContextValueType | null>(null);

export type StepStatus = 'IDLE' | 'IN_PROGRESS' | 'SUCCESS' | 'ERROR' | 'WARNING';

export type Step = {
  key: string;
  title: string;
  component: JSX.Element;
  metadata?: Record<string, any>; // Custom metadata for each step
  status: StepStatus; // Predefined status
  locked?: boolean; // Prevents the user from navigating to this step
};

// Define the provider's props
export type ReactStepperContextProps = {
  children: (currentStepComponent: JSX.Element, stepperComponent?: JSX.Element) => JSX.Element;
  stepperComponent?: JSX.Element;
  steps: (Omit<Step, 'status'> & { status?: StepStatus })[];
  initialStepIndex?: number;
  initialStepValues?: { [key: string | number]: any };
};

export type ReactStepperContextValueType = {
  currentStepIndex: number;
  currentStepKey: string;
  totalSteps: number;
  isThisLastStep: boolean;
  isThisFirstStep: boolean;
  allStepsValues: { [key: string | number]: any };
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (index: number) => void;
  setCurrentStepValues: (values: { [key: string | number]: any }) => void;
  getCurrentStepValues: () => { [key: string | number]: any };
  lockStep: (key: string) => void;
  unlockStep: (key: string) => void;
  unlockNextStep: () => void;
  isStepLocked: (key: string) => boolean;
  isNextStepLocked: () => boolean;
  isPreviousStepLocked: () => boolean;
};

// Create the provider component
export const ReactStepperContext: React.FC<ReactStepperContextProps> = ({
  children,
  steps,
  stepperComponent,
  initialStepIndex = 0,
  initialStepValues = {},
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [allStepsValues, setAllStepsValues] = useState(initialStepValues);
  const [stepsState, setStepsState] = useState<Step[]>(
    steps.map((step) => ({
      ...step,
      status: step.status || 'IDLE',
      locked: step.locked || false,
    }))
  );

  const currentStep = useMemo(() => stepsState[currentStepIndex], [stepsState, currentStepIndex]);
  const currentStepKey = currentStep.key;

  const setCurrentStepValues = (values: { [key: string | number]: any }) => {
    setAllStepsValues((prevValues) => ({
      ...prevValues,
      [currentStepKey]: values,
    }));
  };

  const getCurrentStepValues = () => allStepsValues[currentStepKey] || {};

  const lockStep = (key: string) => {
    setStepsState((prevSteps) => prevSteps.map((step) => (step.key === key ? { ...step, locked: true } : step)));
  };

  const unlockStep = (key: string) => {
    setStepsState((prevSteps) => prevSteps.map((step) => (step.key === key ? { ...step, locked: false } : step)));
  };

  const unlockNextStep = () => {
    if (currentStepIndex < stepsState.length - 1) {
      setStepsState((prevSteps) =>
        prevSteps.map((step, index) => (index === currentStepIndex + 1 ? { ...step, locked: false } : step))
      );
    }
  };

  const isNextStepLocked = useMemo(
    () => currentStepIndex < stepsState.length - 1 && stepsState[currentStepIndex + 1].locked,
    [currentStepIndex, stepsState]
  );
  const isPreviousStepLocked = useMemo(
    () => currentStepIndex > 0 && stepsState[currentStepIndex - 1].locked,
    [currentStepIndex, stepsState]
  );
  const isStepLocked = useMemo(() => (key: string) => !!stepsState.find((s) => s.key === key)?.locked, [stepsState]);
  
  const goToNextStep = () => {
    let nextIndex = currentStepIndex + 1;
    while (nextIndex < stepsState.length && stepsState[nextIndex].locked) {
      nextIndex++;
    }
    if (nextIndex < stepsState.length) {
      setCurrentStepIndex(nextIndex);
    }
  };

  const goToPreviousStep = () => {
    let prevIndex = currentStepIndex - 1;
    while (prevIndex >= 0 && stepsState[prevIndex].locked) {
      prevIndex--;
    }
    if (prevIndex >= 0) {
      setCurrentStepIndex(prevIndex);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < stepsState.length && !stepsState[index].locked) {
      setCurrentStepIndex(index);
    }
  };

  return (
    <StepperContext.Provider
      value={{
        currentStepIndex,
        currentStepKey,
        totalSteps: steps.length,
        isThisLastStep: currentStepIndex === steps.length - 1,
        isThisFirstStep: currentStepIndex === 0,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        allStepsValues,
        setCurrentStepValues,
        getCurrentStepValues,
        lockStep,
        unlockStep,
        unlockNextStep,
        isStepLocked,
        isNextStepLocked,
        isPreviousStepLocked,
      }}
    >
      {children(currentStep.component, stepperComponent)}
    </StepperContext.Provider>
  );
};

export const useReactStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useReactStepper must be used within a StepperProvider');
  }
  return context;
};
