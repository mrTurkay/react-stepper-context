# React Stepper Context

![npm](https://img.shields.io/npm/v/react-stepper-context) ![downloads](https://img.shields.io/npm/dm/react-stepper-context) ![license](https://img.shields.io/npm/l/react-stepper-context)

A lightweight and flexible **React Context** for managing multi-step flows in **React** and **React Native**.  
Whether you're building multi-step wizards, onboarding flows, or checkout processes, React Stepper Context provides a customizable and easy-to-use framework.

---

## 🚀 Features

- **Customizable Layouts**: Fully control the design of your stepper and navigation components.
- **Built for React & React Native**: Works seamlessly across platforms.
- **Flexible Step Management**: Control locking, navigation, and form state at each step.
- **Lightweight API**: Leverages React Context and hooks for clean and reusable logic.

Common Use Cases:
- Onboarding flows
- Multi-step forms
- Checkout processes

---

## 📦 Installation

Install the package via npm or yarn:

```bash
npm install react-stepper-context
```

or

```bash
yarn add react-stepper-context
```
---

<br>
<br>
<br>

# 🛠 Usage

React Stepper Context allows you to define steps, manage navigation, and handle state within a multi-step flow.
Here’s a simple example:


### Example Setup

```tsx
import { ReactStepperContext } from 'react-stepper-context';

const steps = [
  {
    key: 'step1',
    component: <Step1 />,
    title: 'Step 1',
  },
  {
    key: 'step2',
    component: <Step2 />,
    title: 'Step 2',
    locked: true,
  },
];

function App() {
  return (
    <ReactStepperContext steps={steps}>
      {(currentStepComponent) => (
        // Just create your layout here and use. 
        // currentStepComponent is a JSX.Element that you can easily place in your layout.
        <div className="wrapper">
          <Sidebar />
          {currentStepComponent}
        </div>
      )}
    </ReactStepperContext>
  );
}
```

### Step Component Example
Each step manages its own form values and navigation logic using the useReactStepperContext hook.

> Just import and use the `useReactStepperContext` hook, it will provide you with all the necessary functions and values.

```tsx
import React from 'react';
import { useReactStepperContext } from 'react-stepper-context';

export const Step1: React.FC = () => {
  const { setCurrentStepValues, goToNextStep, goToPreviousStep } = useReactStepperContext(); 

  const handleSubmit = () => {
    setCurrentStepValues({ key: 'value' });
    goToNextStep();
  };

  return (
    <div>
      <h2>Step 1</h2>
      <button onClick={goToPreviousStep}>Previous</button>
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};
```

### Sidebar Example
The sidebar dynamically displays the steps and their statuses, enabling navigation between steps.

```tsx
import { useReactStepperContext } from 'react-stepper-context';

export const Sidebar = () => {
  const { steps, currentStepKey, goToStep } = useReactStepperContext(); 

  return (
    <div>
      {steps.map((step, index) => (
        <button key={step.key} onClick={() => goToStep(index)} disabled={step.locked}>
          {step.title} - {step.status}
        </button>
      ))}
    </div>
  );
};
```

# 📖 API Reference

## **Enums**

### `StepStatus`
Represents the status of a step in the stepper.

| Value          | Description                        |
|----------------|------------------------------------|
| `IDLE`         | The step is idle.                 |
| `IN_PROGRESS`  | The step is currently in progress.|
| `SUCCESS`      | The step is successfully completed.|
| `ERROR`        | The step encountered an error.    |
| `WARNING`      | The step has a warning.           |

---

## **Types**

### `Step`
Defines a single step in the stepper.

| Property   | Type               | Description                          |
|------------|--------------------|--------------------------------------|
| `key`      | `string`           | Unique identifier for the step.      |
| `title`    | `string`           | Title of the step.                   |
| `component`| `JSX.Element`      | Component rendered for this step.    |
| `metadata` | `Record<string, any>` (optional) | Metadata related to the step. |
| `status`   | `StepStatus`       | The current status of the step.      |
| `locked`   | `boolean` (optional)| Whether the step is locked.         |

---

### `ReactStepperContextProps`
Props required to initialize the `ReactStepperContext`.

| Property            | Type                                  | Description                                                |
|---------------------|---------------------------------------|------------------------------------------------------------|
| `children`          | `(currentStepComponent: JSX.Element) => JSX.Element` | Function that renders the current step component in the layout. |
| `steps`             | `(Omit<Step, 'status'> & { status?: StepStatus })[]` | Array of steps to configure the flow.                     |
| `initialStepIndex`  | `number` (optional)                  | Index of the initial step (default: `0`).                  |
| `initialStepValues` | `{ [key: string | number]: any }` (optional) | Initial values for form state across steps.              |

---

### `ReactStepperContextValueType`
Values and methods available via the `useReactStepperContext` hook.

| Property                      | Type                                     | Description                                                      |
|-------------------------------|------------------------------------------|------------------------------------------------------------------|
| `steps`                       | `Step[]`                                | Array of steps in the stepper.                                   |
| `currentStepIndex`            | `number`                                | The index of the current step.                                   |
| `setCurrentStepIndex`         | `(index: number) => void`               | Updates the current step index.                                  |
| `currentStepKey`              | `string`                                | The key of the current step.                                     |
| `totalStepsCount`             | `number`                                | Total number of steps in the stepper.                            |
| `isThisLastStep`              | `boolean`                               | Whether the current step is the last one.                        |
| `isThisFirstStep`             | `boolean`                               | Whether the current step is the first one.                       |
| `allStepsValues`              | `{ [key: string \| number]: any }`       | Form values from all steps.                                      |
| `goToNextStep`                | `(currentStepStatus?: StepStatus, nextStepStatus?: StepStatus, unlockNextStep?: boolean) => void` | Moves to the next step with optional parameters for step statuses and unlocking. |
| `goToPreviousStep`            | `() => void`                            | Moves to the previous step.                                      |
| `goToStep`                    | `(index: number) => void`               | Moves to the specified step by index.                           |
| `setCurrentStepValues`        | `(values: { [key: string \| number]: any }) => void` | Updates the form values for the current step.                   |
| `getCurrentStepValues`        | `() => { [key: string \| number]: any }` | Retrieves the form values for the current step.                 |
| `lockStep`                    | `(key: string) => void`                 | Locks a specific step by key.                                   |
| `unlockStep`                  | `(key: string) => void`                 | Unlocks a specific step by key.                                 |
| `unlockNextStep`              | `() => void`                            | Unlocks the next step.                                           |
| `isStepLocked`                | `(key: string) => boolean`              | Checks if a specific step is locked.                            |
| `isNextStepLocked`            | `() => boolean`                         | Checks if the next step is locked.                              |
| `isPreviousStepLocked`        | `() => boolean`                         | Checks if the previous step is locked.                          |
| `setCurrentStepStatus`        | `(status: StepStatus) => void`          | Updates the status of the current step.                         |
| `stepsState`                  | `Step[]`                                | Current state of all steps.                                      |
| `areAllStepsSuccessStatus`    | `boolean`                               | Whether all steps have the `SUCCESS` status.                    |
| `isCurrentStepAlreadySubmitted` | `boolean`                             | Whether the current step has already been submitted.            |

---

## **Usage Hooks**

### `useReactStepperContext`
Provides access to the context values and methods listed above, allowing full control over the stepper flow.

```tsx
import { useReactStepperContext } from 'react-stepper-context';

const { steps, currentStepIndex, goToNextStep, lockStep } = useReactStepperContext();
```
--- 
<br>
<br>
<br>
<br>


## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

## 📝 Contribution

Contributions are welcome! If you find bugs or have ideas for improvements, feel free to open an issue or a pull request.