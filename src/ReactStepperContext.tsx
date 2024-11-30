import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { ReactStepperContextProps, ReactStepperContextValueType, StepStatus, Step } from './types';

const StepperContext = createContext<ReactStepperContextValueType | null>(null);

export const ReactStepperContext: React.FC<ReactStepperContextProps> = ({
  children,
  steps: stepsProp,
  initialStepIndex = 0,
  initialStepValues = {},
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    currentStepIndex: initialStepIndex,
    allStepsValues: initialStepValues,
    steps: stepsProp.map((step) => ({
      ...step,
      status: step.status || StepStatus.IDLE,
      locked: step.locked || false,
    })),
  });

  const currentStep = useMemo(() => state.steps[state.currentStepIndex], [state.steps, state.currentStepIndex]);
  const currentStepKey = useMemo(() => currentStep.key, [currentStep]);

  const isThisLastStep = useMemo(
    () => state.currentStepIndex === state.steps.length - 1,
    [state.currentStepIndex, state.steps]
  );
  const isThisFirstStep = useMemo(() => state.currentStepIndex === 0, [state.currentStepIndex]);

  const setCurrentStepValues = (values: { [key: string | number]: any }) => {
    dispatch({ type: 'SET_CURRENT_STEP_VALUES', payload: values });
  };

  const getCurrentStepValues = () => state.allStepsValues[currentStepKey] || {};

  const lockStep = (key: string) => {
    dispatch({ type: 'LOCK_STEP', payload: key });
  };

  const unlockStep = (key: string) => {
    dispatch({ type: 'UNLOCK_STEP', payload: key });
  };

  const unlockNextStep = () => {
    if (!isThisLastStep && state.steps[state.currentStepIndex + 1].locked) {
      dispatch({ type: 'UNLOCK_STEP', payload: state.steps[state.currentStepIndex + 1].key });
    }
  };

  const isNextStepLocked = useCallback(
    () => !isThisLastStep && !!state.steps[state.currentStepIndex + 1].locked,
    [state.currentStepIndex, state.steps]
  );

  const isPreviousStepLocked = useCallback(
    () => !isThisFirstStep && !!state.steps[state.currentStepIndex - 1].locked,
    [state.currentStepIndex, state.steps]
  );

  const isStepLocked = useMemo(() => (key: string) => !!state.steps.find((s) => s.key === key)?.locked, [state.steps]);

  const goToNextStep = (
    currentStepStatus: StepStatus = StepStatus.SUCCESS,
    nextStepStatus: StepStatus = StepStatus.IN_PROGRESS,
    unlockNextStep: boolean = true
  ) => {
    const nextIndex = state.currentStepIndex + 1;
    if (!isThisLastStep && (unlockNextStep || !state.steps[nextIndex].locked)) {
      dispatch({
        type: 'GO_TO_NEXT_STEP',
        payload: { nextIndex, nextStepStatus, currentStepStatus, unlockNextStep },
      });
    }
  };

  const goToPreviousStep = () => goToStep(state.currentStepIndex - 1);

  const goToStep = (index: number) => {
    if (index >= 0 && index < state.steps.length && !state.steps[index].locked) {
      dispatch({ type: 'GO_TO_STEP', payload: index });
    }
  };

  const setCurrentStepStatus = (status: StepStatus) => {
    dispatch({ type: 'SET_CURRENT_STEP_STATUS', payload: status });
  };

  const areAllStepsSuccessStatus = state.steps.every((step) => step.status === StepStatus.SUCCESS);

  const isCurrentStepAlreadySubmitted =
    currentStep.status === StepStatus.SUCCESS || currentStep.status === StepStatus.ERROR;

  return (
    <StepperContext.Provider
      value={{
        steps: state.steps,
        totalStepsCount: state.steps.length,
        currentStepIndex: state.currentStepIndex,
        setCurrentStepIndex: (index: number) => dispatch({ type: 'GO_TO_STEP', payload: index }),
        currentStepKey,
        isThisLastStep,
        isThisFirstStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        allStepsValues: state.allStepsValues,
        setCurrentStepValues,
        getCurrentStepValues,
        lockStep,
        unlockStep,
        unlockNextStep,
        isStepLocked,
        isNextStepLocked,
        isPreviousStepLocked,
        setCurrentStepStatus,
        stepsState: state.steps,
        areAllStepsSuccessStatus,
        isCurrentStepAlreadySubmitted,
      }}
    >
      {children(currentStep.component)}
    </StepperContext.Provider>
  );
};

export const useReactStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useReactStepperContext must be used within a StepperProvider');
  }
  return context;
};
