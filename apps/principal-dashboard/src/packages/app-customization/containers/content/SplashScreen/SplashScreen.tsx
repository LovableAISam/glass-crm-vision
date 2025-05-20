import React from 'react';

import { Stack, Typography, Card, Box, Grid, useTheme } from '@mui/material';
import { ImagePreview, Button } from '@woi/web-component';
import { AppCustomizationContentProps } from '../../AppCustomizationContent';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';

import { useAppCustomization } from '../../../context/AppCustomizationContext';
import { useTranslation } from 'react-i18next';

function SplashScreen(props: AppCustomizationContentProps) {
  const { isDisabled, activeStep, handleComplete, handleStep } = props;
  const [{ themeColor, splashScreen }, dispatch] = useAppCustomization();
  const { selectedFile, selectedImage } = splashScreen;
  const theme = useTheme();
  const { t: tCommon } = useTranslation('common');
  const { t: tAppCustomization } = useTranslation('appCustomization');

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
      );
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
          disabled={!Boolean(selectedImage)}
        >
          {tCommon('actionSave')}
        </Button>
      </Stack>
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{tAppCustomization('splashScreenTitle')}</Typography>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Card elevation={0} sx={{ p: 1, pr: 2, borderRadius: 3, backgroundColor: theme.palette.secondary.main }}>
              <Typography variant="body2">
                <div dangerouslySetInnerHTML={{ __html: tAppCustomization('splashScreenInfo') }} />
              </Typography>
            </Card>
            <Stack direction="column" spacing={1}>
              <ImageUpload
                type="APP_CUSTOMIZATION"
                selectedFile={selectedFile}
                selectedImage={selectedImage}
                onChange={(file) => {
                  dispatch({
                    type: 'SET_SPLASH_SCREEN',
                    payload: {
                      selectedFile: file,
                    }
                  });
                }}
                minWidth={1080}
                minHeight={2280}
                onChangeImage={(file) => dispatch({
                  type: 'SET_SPLASH_SCREEN',
                  payload: {
                    selectedImage: file,
                  }
                })}
              />
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
                selectedFile={selectedFile}
                selectedImage={selectedImage}
                background={themeColor}
              />
              {/** @ts-ignore */}
              <Typography variant="subtitle3" textAlign="center">{tAppCustomization('splashScreenPreview')}</Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      {renderAction()}
    </Box>
  );
}

export default SplashScreen;