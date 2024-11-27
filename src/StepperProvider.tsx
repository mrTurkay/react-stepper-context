import React, { createContext, ReactNode } from 'react';

// Create the context with an empty default value
const StepperContext = createContext<StepperContextValueType | null>(null);

// Define the provider's props
export type StepperProviderProps = {
  children: ReactNode;
};

export type StepperContextValueType = {
  test: string;
};

// Create the provider component
export const StepperProvider: React.FC<StepperProviderProps> = ({
  children,
}) => {
  return (
    <StepperContext.Provider
      value={{
        test: 'murat',
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

// Export the context for future usage
export const useStepperContext = () => React.useContext(StepperContext);
