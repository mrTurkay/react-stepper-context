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
  status?: StepStatus;
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
  totalStepsCount: number;
  isThisLastStep: boolean;
  isThisFirstStep: boolean;
  allStepsValues: { [key: string | number]: any };
  goToNextStep: (currentStepStatus?: StepStatus, nextStepStatus?: StepStatus, unlockNextStep?: boolean) => void;
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
  areAllStepsSuccessStatus: boolean;
  isCurrentStepAlreadySubmitted: boolean;
};
