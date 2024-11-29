import { Step, StepStatus } from './types';

type State = {
  currentStepIndex: number;
  allStepsValues: { [key: string | number]: any };
  steps: Step[];
};

type Action =
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_ALL_STEPS_VALUES'; payload: { [key: string | number]: any } }
  | { type: 'SET_STEPS_STATE'; payload: Step[] }
  | { type: 'LOCK_STEP'; payload: string }
  | { type: 'UNLOCK_STEP'; payload: string }
  | { type: 'SET_CURRENT_STEP_VALUES'; payload: { [key: string | number]: any } }
  | { type: 'SET_CURRENT_STEP_STATUS'; payload: StepStatus }
  | { type: 'SET_NEXT_STEP_STATUS_IN_PROGRESS' }
  | {
      type: 'GO_TO_NEXT_STEP';
      payload: {
        nextIndex: number;
        nextStepStatus: StepStatus;
        currentStepStatus: StepStatus;
        unlockNextStep: boolean;
      };
    };

export const initialState: State = {
  currentStepIndex: 0,
  allStepsValues: {},
  steps: [],
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, currentStepIndex: action.payload };
    case 'GO_TO_NEXT_STEP':
      return {
        ...state,
        currentStepIndex: action.payload.nextIndex,
        steps: state.steps.map((step, index) => {
          if (index === state.currentStepIndex) {
            return { ...step, status: action.payload.currentStepStatus };
          }
          if (index === action.payload.nextIndex) {
            return {
              ...step,
              status: action.payload.nextStepStatus,
              locked: action.payload.unlockNextStep === true ? false : step.locked,
            };
          }
          return step;
        }),
      };
    case 'LOCK_STEP':
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.key === action.payload && !step.locked ? { ...step, locked: true } : step
        ),
      };
    case 'UNLOCK_STEP':
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.key === action.payload && step.locked ? { ...step, locked: false } : step
        ),
      };
    case 'SET_CURRENT_STEP_VALUES':
      return {
        ...state,
        allStepsValues: {
          ...state.allStepsValues,
          [state.steps[state.currentStepIndex].key]: action.payload,
        },
      };
    case 'SET_ALL_STEPS_VALUES':
      return { ...state, allStepsValues: action.payload };
    case 'SET_CURRENT_STEP_STATUS':
      return {
        ...state,
        steps: state.steps.map((step, index) =>
          index === state.currentStepIndex ? { ...step, status: action.payload } : step
        ),
      };
    default:
      return state;
  }
};
