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
  Avatar,
  FormControl,
  FormHelperText,
  useTheme,
  Box,
  Divider,
} from '@mui/material';
import { Button, FormEditor, Markdown, Token } from '@woi/web-component';
import { useController } from 'react-hook-form';
import { SMSContentData } from '@woi/service/co/admin/smsContent/smsContentList';
import useSMSContentUpsert from '../hooks/useSMSContentUpsert';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

type CreateSMSContentManagementModalProps = {
  selectedData: SMSContentData | null;
  isActive: boolean;
  onHide: () => void;
  fetchSMSContentList: () => void;
};

const CreateSMSContentManagementModal = (
  props: CreateSMSContentManagementModalProps,
) => {
  const { isActive, selectedData, onHide, fetchSMSContentList } = props;
  const theme = useTheme();

  const {
    smsContentTypeOptions,
    formData,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
  } = useSMSContentUpsert({ selectedData, onHide, fetchSMSContentList });
  const { t: tCommon } = useTranslation('common');
  const { t: tSMSContent } = useTranslation('smsContent');
  const { t: tForm } = useTranslation('form');

  const {
    formState: { errors },
    control,
    getValues,
  } = formData;

  const isUpdate = Boolean(selectedData);

  const { field: fieldSubject } = useController({
    name: 'subject',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Subject' }),
    },
  });

  const { field: fieldContent } = useController({
    name: 'content',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Content' }),
    },
  });

  const { field: fieldSMSContentType } = useController({
    name: 'transactionTypeId',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'SMS content type',
      }),
    },
  });

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {isUpdate
              ? tSMSContent('modalUpdateTitle')
              : tSMSContent('modalCreateTitle')}
          </Typography>
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
                <Typography variant="subtitle2" gutterBottom>
                  {tSMSContent('formSMSSubject')}
                </Typography>
                <TextField
                  {...fieldSubject}
                  disabled
                  fullWidth
                  placeholder={tForm('placeholderType', {
                    fieldName: 'sms subject',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.subject)}
                  helperText={errors.subject?.message}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tSMSContent('formSMSContent')}
                </Typography>
                <Card
                  elevation={0}
                  sx={{
                    p: 1,
                    pr: 2,
                    borderRadius: 3,
                    mb: 1,
                    backgroundColor: theme.palette.secondary.main,
                  }}
                >
                  <Typography variant="body2">
                    <ul>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tSMSContent('infoSMSContentDescription'),
                          }}
                        />
                      </li>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tSMSContent('infoSMSContentDescription2'),
                          }}
                        />
                      </li>
                    </ul>
                    <Typography
                      variant="subtitle2"
                      style={{ textTransform: 'none' }}
                    >
                      {tSMSContent('infoSMSContentTitle')}
                    </Typography>
                    <ul style={{ marginTop: '0px' }}>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tSMSContent('infoSMSContentDescription3'),
                          }}
                        />
                      </li>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tSMSContent('infoSMSContentDescription4'),
                          }}
                        />
                      </li>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tSMSContent('infoSMSContentDescription5'),
                          }}
                        />
                      </li>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tSMSContent('infoSMSContentDescription6'),
                          }}
                        />
                      </li>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tSMSContent('infoSMSContentDescription7'),
                          }}
                        />
                      </li>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tSMSContent('infoSMSContentDescription8'),
                          }}
                        />
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
                    onChange={value => fieldContent.onChange(value)}
                  />
                  {Boolean(errors.content) && (
                    <FormHelperText sx={{ color: Token.color.redDark }}>
                      {errors.content?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tSMSContent('formSMSContentType')}
                </Typography>
                <Autocomplete
                  {...fieldSMSContentType}
                  disabled
                  onChange={(_, value) => fieldSMSContentType.onChange(value)}
                  options={smsContentTypeOptions}
                  fullWidth
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'content type',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
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
            <Card
              elevation={0}
              sx={{
                background: Token.color.dashboardLightest,
                p: 3,
                borderRadius: 4,
                height: '100%',
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {tSMSContent('preview')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{
                    backgroundColor: Token.color.secondaryBlueTintLightest,
                    width: 48,
                    height: 48,
                  }}
                >
                  <PersonOutlineIcon
                    sx={{
                      color: Token.color.primaryBlue,
                      width: 32,
                      height: 32,
                    }}
                  />
                </Avatar>
                <Card sx={{ p: 3, borderRadius: 4 }}>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {getValues('subject') ||
                        tSMSContent('placeholderSMSSubject')}
                    </Typography>
                    {getValues('content') ? (
                      <Markdown
                        typographyProps={{
                          variant: 'body2',
                        }}
                      >
                        {getValues('content')}
                      </Markdown>
                    ) : (
                      <Typography variant="body2">
                        {tSMSContent('placeholderSMSContent')}
                      </Typography>
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={isUpdate ? 'space-between' : 'flex-end'}
          sx={{ p: 2, flex: 1 }}
        >
          {isUpdate && (
            <Stack direction="row" spacing={2} display="none">
              <Button
                variant="text"
                startIcon={
                  getValues('isActive') ? <ToggleOffIcon /> : <ToggleOnIcon />
                }
                color={getValues('isActive') ? 'warning' : 'success'}
                onClick={handleActivateDeactivate}
                sx={{ py: 1, borderRadius: 2 }}
              >
                {getValues('isActive')
                  ? tSMSContent('actionDectivate')
                  : tSMSContent('actionActivate')}
              </Button>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <AuthorizeView access="sms-content" privileges={['delete']}>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={handleDelete}
                  sx={{ py: 1, borderRadius: 2 }}
                >
                  {tSMSContent('actionDelete')}
                </Button>
              </AuthorizeView>
            </Stack>
          )}
          <AuthorizeView access="sms-content" privileges={['create', 'update']}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
              sx={{ flex: 1 }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tCommon('actionCancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleUpsert}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tCommon('actionSave')}
              </Button>
            </Stack>
          </AuthorizeView>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSMSContentManagementModal;
