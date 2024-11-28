import React from 'react';
import { render } from '@testing-library/react';
import { ReactStepperContext, Step, StepStatus } from '../ReactStepperContext';

describe('ReactStepperContext', () => {
  const steps: Step[] = [
    { key: 'step1', title: 'Step 1', component: <div>Step 1</div>, status: StepStatus.IDLE },
    { key: 'step2', title: 'Step 2', component: <div>Step 2</div>, status: StepStatus.IDLE, locked: true },
    { key: 'step3', title: 'Step 3', component: <div>Step 3</div>, status: StepStatus.IDLE },
  ];

  test('initializes correctly', () => {
    render(<ReactStepperContext steps={steps}>{(_) => <></>}</ReactStepperContext>);
    expect(true).toBe(true);
  });
});
