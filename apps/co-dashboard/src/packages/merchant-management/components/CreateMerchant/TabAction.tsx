// Core
import React, { Dispatch, SetStateAction } from 'react';

// Components
import { Divider, Step, StepButton, Stepper } from '@mui/material';

type TabActionProps = {
  validateForm?: (callback: () => void) => void;
  steps: string[];
  activeStep: number;
  completed: { [k: number]: boolean; };
  setActiveStep: Dispatch<SetStateAction<number>>;
};

function TabAction(props: TabActionProps) {
  const { activeStep, completed, setActiveStep, validateForm, steps } = props;

  const handleChangeStep = (value: number) => {
    if (typeof validateForm === 'function') {
      validateForm(() => setActiveStep(value));
    } else {
      setActiveStep(value);
    }
  };

  return (
    <React.Fragment>
      <Stepper
        nonLinear
        activeStep={activeStep}
        sx={{ px: { xl: 10, md: 5, xs: 0 }, my: 2, mt: 6 }}
      >
        {steps.map((label, index) => (
          <Step
            key={label}
            completed={completed[index]}
            disabled={!completed[index]}
          >
            <StepButton color="inherit" onClick={() => handleChangeStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Divider sx={{ mb: 2 }} />
    </React.Fragment>
  );
}

export default TabAction;
