import React, { Dispatch, SetStateAction } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Button, useConfirmationDialog } from '@woi/web-component';
import { useTranslation } from 'react-i18next';
import { useController } from 'react-hook-form';
import useSystemParameterUpsert from '../hooks/useSystemParameterUpsert';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { SystemParameterData } from '@woi/service/co/admin/systemParameter/systemParameterList';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

// Icons
import CloseIcon from '@mui/icons-material/Close';

type CreateSystemParameterModalProps = {
  selectedData: SystemParameterData | null;
  isActive: boolean;
  onHide: () => void;
  fetchSystemParameterList: () => void;
  setSelectedId: Dispatch<SetStateAction<SystemParameterData | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  showModal: () => void;
  loading: boolean;
};

const CreateSystemParameterModal = (props: CreateSystemParameterModalProps) => {
  const {
    isActive,
    onHide,
    selectedData,
    fetchSystemParameterList,
    setSelectedId,
    showModal,
    setLoading,
    loading,
  } = props;
  const { t: tCommon } = useTranslation('common');
  const { t: tForm } = useTranslation('form');
  const { getConfirmation } = useConfirmationDialog();

  const { valueTypeOptions, formData, handleUpsert, getValues, reset } =
    useSystemParameterUpsert({
      onHide,
      selectedData,
      fetchSystemParameterList,
      showModal,
      setLoading,
      setSelectedId,
    });

  const isUpdate = Boolean(selectedData);

  const {
    formState: { errors },
    control,
  } = formData;

  const { field: fieldCode } = useController({
    name: 'code',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'parameter code' }),
    },
  });

  const { field: fieldValueType } = useController({
    name: 'valueType',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'value type' }),
    },
  });

  const { field: fieldValueString } = useController({
    name: 'valueText',
    control,
    rules: {
      required:
        getValues('valueType.value') === 'text'
          ? tForm('generalErrorRequired', { fieldName: 'value' })
          : '',
    },
  });

  const { field: fieldValueDate } = useController({
    name: 'valueDate',
    control,
    rules: {
      required:
        getValues('valueType.value') === 'date'
          ? tForm('generalErrorRequired', { fieldName: 'date' })
          : '',
    },
  });

  const { field: fieldDescription } = useController({
    name: 'description',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'description' }),
    },
  });

  const handleClose = () => {
    if (!loading) {
      onHide();
      reset();
      setSelectedId(null);
    }
  };

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelTitle', { text: 'System Parameter' }),
      message: tCommon('confirmationCancelDescription'),
      primaryText: tCommon('confirmationCancelYes'),
      secondaryText: tCommon('confirmationCancelNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error',
    });
    if (confirmed) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={isActive}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {isUpdate ? 'Update' : 'Add'} System Parameter
          </Typography>
          <IconButton data-testid="closeButton" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Parameter Code
            </Typography>
            <TextField
              {...fieldCode}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'parameter code',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.code)}
              helperText={errors.code?.message}
              disabled
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Value Type
            </Typography>
            <Autocomplete
              {...fieldValueType}
              onChange={(_, value) => {
                fieldValueType.onChange(value);
              }}
              options={valueTypeOptions}
              fullWidth
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'value type',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.valueType)}
                  helperText={errors.valueType?.message}
                />
              )}
              disabled
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Value
            </Typography>
            {getValues('valueType.value') === 'text' ? (
              <TextField
                {...fieldValueString}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'value' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                error={Boolean(errors.valueText)}
                helperText={errors.valueText?.message}
              />
            ) : (
              <DesktopDatePicker
                {...fieldValueDate}
                minDate={new Date()}
                inputFormat="dd/MM/yyyy"
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder="select effective date"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                    error={Boolean(errors.valueDate)}
                    helperText={errors.valueDate?.message}
                  />
                )}
              />
            )}
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Description
            </Typography>
            <TextField
              {...fieldDescription}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'description',
              })}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              disabled
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <AuthorizeView
          access="system-parameter"
          privileges={['create', 'update']}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
            sx={{ p: 2 }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{ py: 1, px: 5, borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpsert}
              disabled={loading}
              sx={{ py: 1, px: 5, borderRadius: 2 }}
            >
              {loading ? (
                <CircularProgress style={{ width: '25px', height: '25px' }} />
              ) : (
                tCommon('actionSave')
              )}
            </Button>
          </Stack>
        </AuthorizeView>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSystemParameterModal;
