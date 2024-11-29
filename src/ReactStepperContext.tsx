import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const StepperContext = createContext<ReactStepperContextValueType | null>(null);

export enum StepStatus {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export type Step = {
  key: string;
  title: string;
  component: JSX.Element;
  metadata?: Record<string, any>;
  status: StepStatus;
  locked?: boolean;
};

export type ReactStepperContextProps = {
  children: (currentStepComponent: JSX.Element) => JSX.Element;
  steps: (Omit<Step, 'status'> & { status?: StepStatus })[];
  initialStepIndex?: number;
  initialStepValues?: { [key: string | number]: any };
};

export type ReactStepperContextValueType = {
  steps: Step[];
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;

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
  setCurrentStepStatus: (status: StepStatus) => void;
  stepsState: Step[];
  setStepsState: (steps: Step[]) => void;
  areAllStepsSuccessStatus: boolean;
};

export const ReactStepperContext: React.FC<ReactStepperContextProps> = ({
  children,
  steps,
  initialStepIndex = 0,
  initialStepValues = {},
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [allStepsValues, setAllStepsValues] = useState(initialStepValues);
  const [stepsState, setStepsState] = useState<Step[]>(
    steps.map((step) => ({
      ...step,
      status: step.status || StepStatus.IDLE,
      locked: step.locked || false,
    }))
  );

  const currentStep = useMemo(() => stepsState[currentStepIndex], [stepsState, currentStepIndex]);
  const currentStepKey = useMemo(() => currentStep.key, [currentStep]);

  const isThisLastStep = useMemo(() => currentStepIndex === stepsState.length - 1, [currentStepIndex, stepsState]);
  const isThisFirstStep = useMemo(() => currentStepIndex === 0, [currentStepIndex]);

  const setCurrentStepValues = (values: { [key: string | number]: any }) => {
    setAllStepsValues((prevValues) => ({
      ...prevValues,
      [currentStepKey]: values,
    }));
  };

  const getCurrentStepValues = () => allStepsValues[currentStepKey] || {};

  const lockStep = (key: string) => {
    setStepsState((prevSteps) =>
      prevSteps.map((step) => (step.key === key && !step.locked ? { ...step, locked: true } : step))
    );
  };

  const unlockStep = (key: string) => {
    setStepsState((prevSteps) =>
      prevSteps.map((step) => (step.key === key && step.locked ? { ...step, locked: false } : step))
    );
  };

  const unlockNextStep = () => {
    if (!isThisLastStep && stepsState[currentStepIndex + 1].locked) {
      setStepsState((prevSteps) =>
        prevSteps.map((step, index) => (index === currentStepIndex + 1 ? { ...step, locked: false } : step))
      );
    }
  };
  const isNextStepLocked = useCallback(
    () => !isThisLastStep && !!stepsState[currentStepIndex + 1].locked,
    [currentStepIndex, stepsState]
  );
  const isPreviousStepLocked = useCallback(
    () => !isThisFirstStep && !!stepsState[currentStepIndex - 1].locked,
    [currentStepIndex, stepsState]
  );
  const isStepLocked = useMemo(() => (key: string) => !!stepsState.find((s) => s.key === key)?.locked, [stepsState]);

  const goToNextStep = () => {
    let nextIndex = currentStepIndex + 1;
    while (nextIndex < stepsState.length && stepsState[nextIndex].locked) {
      nextIndex++;
    }
    if (nextIndex === currentStepIndex || nextIndex >= stepsState.length) return; // No movement
    setCurrentStepIndex(nextIndex);

    setNextStepStatusInProgressIfItIsIdle();
  };

  const goToPreviousStep = () => {
    let prevIndex = currentStepIndex - 1;
    while (!isThisFirstStep && stepsState[prevIndex].locked) {
      prevIndex--;
    }
    if (prevIndex === currentStepIndex || prevIndex < 0) return; // No movement
    setCurrentStepIndex(prevIndex);
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < stepsState.length && !stepsState[index].locked) {
      setCurrentStepIndex(index);
    }
  };

  const setCurrentStepStatus = (status: StepStatus) => {
    setStepsState((prevSteps) =>
      prevSteps.map((step, index) => (index === currentStepIndex ? { ...step, status } : step))
    );
  };

  const setNextStepStatusInProgressIfItIsIdle = () => {
    if (!isThisLastStep && stepsState[currentStepIndex + 1].status === StepStatus.IDLE) {
      setStepsState((prevSteps) =>
        prevSteps.map((step, index) =>
          index === currentStepIndex + 1 ? { ...step, status: StepStatus.IN_PROGRESS } : step
        )
      );
    }
  };

  const areAllStepsSuccessStatus = stepsState.every((step) => step.status === StepStatus.SUCCESS);

  return (
    <StepperContext.Provider
      value={{
        steps: stepsState,
        currentStepIndex,
        setCurrentStepIndex,
        currentStepKey,
        totalSteps: steps.length,
        isThisLastStep,
        isThisFirstStep,
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
        setCurrentStepStatus,
        stepsState,
        setStepsState,
        areAllStepsSuccessStatus,
      }}
    >
      {children(currentStep.component)}
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
