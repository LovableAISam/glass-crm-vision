import React from 'react';
import {
  Stack,
  Typography,
  Stepper,
  StepButton,
  Step,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';

// Components
import { CreateCOModalContentProps } from './CreateCOModalContent';

// Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';

type TabActionProps = CreateCOModalContentProps & {
  validateForm?: (callback: () => void) => void;
}

function TabAction(props: TabActionProps) {
  const { selectedData, activeStep, completed, handleStep, validateForm } = props;
  const { t: tCO } = useTranslation('co');

  const isUpdate = Boolean(selectedData);

const steps = [
  tCO('tabActionAccountInformation'), 
  tCO('tabActionIdentityData'), 
  tCO('tabActionPICData'), 
  tCO('tabActionConfiguration')
];

  const handleChangeStep = (value: number) => {
    if (typeof validateForm === 'function') {
      validateForm(() => handleStep(value));
    } else {
      handleStep(value)
    }
  }

  return (
    <React.Fragment>
      {isUpdate ? (
        <Tabs
          value={activeStep}
          onChange={(_, value) => handleChangeStep(value)}
          variant="fullWidth"
          centered
          sx={{ mb: 2 }}
        >
          <Tab
            label={(
              <Stack direction="row" spacing={1} alignItems="center">
                <FolderSharedIcon />
                {/** @ts-ignore */}
                <Typography variant="subtitle3">{tCO('tabActionAccountInformation')}</Typography>
              </Stack>
            )}
          />
          <Tab
            label={(
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon />
                {/** @ts-ignore */}
                <Typography variant="subtitle3">{tCO('tabActionIdentityData')}</Typography>
              </Stack>
            )}
          />
          <Tab
            label={(
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon />
                {/** @ts-ignore */}
                <Typography variant="subtitle3">{tCO('tabActionPICData')}</Typography>
              </Stack>
            )}
          />
          <Tab
            label={(
              <Stack direction="row" spacing={1} alignItems="center">
                <SettingsIcon />
                {/** @ts-ignore */}
                <Typography variant="subtitle3">{tCO('tabActionConfiguration')}</Typography>
              </Stack>
            )}
          />
        </Tabs>
      ) : (
        <Stepper nonLinear activeStep={activeStep} sx={{ px: { xl: 10, md: 5, xs: 0 }, my: 2 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]} disabled={!completed[index]}>
              <StepButton color="inherit" onClick={() => handleChangeStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      )}
      <Divider sx={{ mb: 2 }} />
    </React.Fragment>
  )
}

export default TabAction;