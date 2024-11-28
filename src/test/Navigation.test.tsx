import { render } from '@testing-library/react';
import { ReactStepperContext, Step, StepStatus, useReactStepper } from '../ReactStepperContext';
import React from 'react';

describe('Navigation', () => {
  const steps: Step[] = [
    { key: 'step1', title: 'Step 1', component: <div>Step 1</div>, status: StepStatus.IDLE },
    { key: 'step2', title: 'Step 2', component: <div>Step 2</div>, status: StepStatus.IDLE, locked: true },
    { key: 'step3', title: 'Step 3', component: <div>Step 3</div>, status: StepStatus.IDLE },
  ];

  test('goToNextStep does go on locked steps', () => {
    let currentStepIndex = 0;

    const TestComponent = () => {
      const { goToNextStep, currentStepIndex: index } = useReactStepper();
      React.useEffect(() => {
        goToNextStep();
      }, [goToNextStep]);
      return null;
    };

    render(
      <ReactStepperContext steps={steps} initialStepIndex={0}>
        {() => <TestComponent />}
      </ReactStepperContext>
    );

    expect(currentStepIndex).toBe(0);
  });

  test('goToStep navigates correctly', () => {
    let currentStepIndex = 0;

    const TestComponent = () => {
      const { goToStep, currentStepIndex: index } = useReactStepper();
      currentStepIndex = index;
      React.useEffect(() => {
        goToStep(2);
      }, [goToStep]);
      return null;
    };

    render(
      <ReactStepperContext steps={steps} initialStepIndex={0}>
        {() => <TestComponent />}
      </ReactStepperContext>
    );

    expect(currentStepIndex).toBe(2);
  });
});
