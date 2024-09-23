import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  TextField,
  Grid,
  Autocomplete,
  Card,
  FormControl,
  FormHelperText,
  useTheme,
  Box,
  Divider,
} from '@mui/material';
import { Button, FormEditor, Markdown, Token } from '@woi/web-component';
import { useController } from 'react-hook-form';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { EmailContentData } from '@woi/service/principal/admin/emailContent/emailContentList';
import useEmailContentUpsert from '../hooks/useEmailContentUpsert';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

type CreateEmailManagementModalProps = {
  selectedData: EmailContentData | null;
  isActive: boolean;
  onHide: () => void;
  fetchEmailContentList: () => void;
}

const CreateEmailManagementModal = (props: CreateEmailManagementModalProps) => {
  const { isActive, selectedData, onHide, fetchEmailContentList } = props;
  const theme = useTheme();

  const {
    emailContentTypeOptions,
    formData,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
  } = useEmailContentUpsert({ selectedData, onHide, fetchEmailContentList });
  const { t: tCommon } = useTranslation('common');
  const { t: tEmailContent } = useTranslation('emailContent');
  const { t: tForm } = useTranslation('form');

  const { formState: { errors }, control, getValues } = formData;

  const isUpdate = Boolean(selectedData);

  const { field: fieldSubject } = useController({
    name: 'subject',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Subject' }),
    }
  });

  const { field: fieldContent } = useController({
    name: 'content',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Content' }),
    }
  });

  const { field: fieldEmailContentType } = useController({
    name: 'transactionTypeId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Email content type' }),
    }
  });

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        }
      }}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{isUpdate ? tEmailContent('modalUpdateTitle') : tEmailContent('modalCreateTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={6} xs={12}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>{tEmailContent('formEmailSubject')}</Typography>
                <TextField
                  {...fieldSubject}
                  fullWidth
                  placeholder={tForm('placeholderType', { fieldName: 'email subject' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  error={Boolean(errors.subject)}
                  helperText={errors.subject?.message}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>{tEmailContent('formEmailContent')}</Typography>
                <Card elevation={0} sx={{ p: 1, pr: 2, borderRadius: 3, mb: 1, backgroundColor: theme.palette.secondary.main }}>
                  <Typography variant="body2">
                    <ul>
                      <li>{tEmailContent('infoEmailContentTitle')}</li>
                      <li>
                        <div dangerouslySetInnerHTML={{ __html: tEmailContent('infoEmailContentDescription') }} />
                      </li>
                    </ul>
                  </Typography>
                </Card>
                <FormControl
                  component="fieldset"
                  variant="standard"
                  sx={{ width: '100%' }}
                >
                  <FormEditor
                    {...fieldContent}
                    onChange={(value) => fieldContent.onChange(value)}
                  />
                  {Boolean(errors.content) && (
                    <FormHelperText sx={{ color: Token.color.redDark }}>
                      {errors.content?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>{tEmailContent('formEmailContentType')}</Typography>
                <Autocomplete
                  {...fieldEmailContentType}
                  onChange={(_, value) => fieldEmailContentType.onChange(value)}
                  options={emailContentTypeOptions}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', { fieldName: 'content type' })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                      error={Boolean(errors.transactionTypeId)}
                      helperText={errors.transactionTypeId?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card elevation={0} sx={{ background: Token.color.dashboardLightest, p: 3, borderRadius: 4, height: '100%' }}>
              <Stack sx={{ height: '100%' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>{tEmailContent('preview')}</Typography>
                <Card sx={{ p: 3, borderRadius: 4, flexGrow: 1 }}>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {getValues('subject') || tEmailContent('placeholderEmailSubject')}
                    </Typography>
                    <Card elevation={0} sx={{ borderRadius: 4, width: '100%', height: 100, background: Token.color.greyscaleGreyLightest }} />
                    {getValues('content') ? (
                      <Markdown
                        typographyProps={{
                          variant: 'body2',
                        }}
                      >
                        {getValues('content')}
                      </Markdown>
                    ) : (
                      <Typography variant="body2">{tEmailContent('placeholderEmailContent')}</Typography>
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" alignItems="center" justifyContent={isUpdate ? 'space-between' : 'flex-end'} sx={{ p: 2, flex: 1 }}>
          {isUpdate && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="text"
                startIcon={getValues('isActive') ? <ToggleOffIcon /> : <ToggleOnIcon />}
                color={getValues('isActive') ? "warning" : "success"}
                onClick={handleActivateDeactivate}
                sx={{ py: 1, borderRadius: 2 }}
              >
                {getValues('isActive') ? tEmailContent('actionDectivate') : tEmailContent('actionActivate')}
              </Button>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <AuthorizeView access="email-content" privileges={['delete']}>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={handleDelete}
                  sx={{ py: 1, borderRadius: 2 }}
                >
                  {tEmailContent('actionDelete')}
                </Button>
              </AuthorizeView>
            </Stack>
          )}
          <AuthorizeView access="email-content" privileges={['create', 'update']}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ flex: 1 }}>
              <Button variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
              <Button variant="contained" onClick={handleUpsert} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
            </Stack>
          </AuthorizeView>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default CreateEmailManagementModal;