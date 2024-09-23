import React from 'react';

import { Stack, Typography, Card, Box, Grid, useTheme } from '@mui/material';
import { Button, FormColor, ImagePreview } from '@woi/web-component';
import { AppCustomizationContentProps } from '../../AppCustomizationContent';
import { useAppCustomization } from '../../../context/AppCustomizationContext';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';

function ColorTheme(props: AppCustomizationContentProps) {
  const { activeStep, isDisabled, handleComplete, handleStep } = props;
  const [{ themeColor }, dispatch] = useAppCustomization();
  const theme = useTheme();
  const { t: tCommon } = useTranslation('common');
  const { t: tAppCustomization } = useTranslation('appCustomization');

  const handleChoose = (color: string) => {
    dispatch({
      type: 'SET_THEME_COLOR',
      payload: {
        themeColor: color,
      }
    })
  }

  const renderAction = () => {
    if (isDisabled) {
      return (
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ py: 5 }}>
          <Button
            color="primary"
            variant="outlined"
            sx={{ px: 8, py: 1, borderRadius: 2 }}
            disabled={activeStep <= 0}
            onClick={() => handleStep(activeStep - 1)}
          >
            {tCommon('actionGoBack')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            sx={{ px: 8, py: 1, borderRadius: 2 }}
            onClick={() => handleStep(activeStep + 1)}
          >
            {tCommon('actionNext')}
          </Button>
        </Stack>
      )
    }

    return (
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ py: 5 }}>
        <Button
          color="primary"
          variant="outlined"
          sx={{ px: 8, py: 1, borderRadius: 2 }}
          disabled={activeStep <= 0}
          onClick={() => handleStep(activeStep - 1)}
        >
          {tCommon('actionGoBack')}
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{ px: 8, py: 1, borderRadius: 2 }}
          onClick={() => handleComplete(activeStep + 1)}
        >
          {tCommon('actionSave')}
        </Button>
      </Stack>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{tAppCustomization('colorThemeTitle')}</Typography>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Card elevation={0} sx={{ p: 1, pr: 2, borderRadius: 3, backgroundColor: theme.palette.secondary.main }}>
              <Typography variant="body2">
                <div dangerouslySetInnerHTML={{ __html: tAppCustomization('colorThemeInfo') }} />
              </Typography>
            </Card>
            <FormColor
              value={themeColor}
              onChange={handleChoose}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
            <Stack direction="column" alignItems="flex-start">
              <Button
                variant="text"
                onClick={() => dispatch({ type: 'RESET_THEME_COLOR' })}
                startIcon={<RefreshIcon />}
              >
                {tCommon('actionResetToDefault')}
              </Button>
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Stack direction="column" spacing={2} alignItems="center">
              <ImagePreview
                selectedFile={null}
                selectedImage={null}
                background={themeColor}
                type="THEME"
              />
              {/** @ts-ignore */}
              <Typography variant="subtitle3" textAlign="center">{tAppCustomization('colorThemePreview')}</Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      {renderAction()}
    </Box>
  )
}

export default ColorTheme;