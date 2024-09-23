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
} from '@mui/material';
import { Button, FormSingleDatePicker } from '@woi/web-component';
import useAMLAHolidayUpsert from '../hooks/useAMLAHolidayUpsert';
import { useController } from 'react-hook-form';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';

type CreateHolidayProps = {
  isActive: boolean;
  onHide: () => void;
  fetchAMLAHolidayList: () => void;
};

const CreateHolidayModal = (props: CreateHolidayProps) => {
  const { isActive, onHide, fetchAMLAHolidayList } = props;
  const { formData, handleUpsert, handleCancel } = useAMLAHolidayUpsert({
    onHide,
    fetchAMLAHolidayList,
  });
  const {
    formState: { errors },
    control,
  } = formData;
  const { t: tCommon } = useTranslation('common');
  const { t: tAMLAHoliday } = useTranslation('amlaHoliday');
  const { t: tForm } = useTranslation('form');

  const { field: fieldName } = useController({
    name: 'holidayName',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Holiday name' }),
    },
  });

  const { field: fieldDate } = useController({
    name: 'date',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Date' }),
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
            {tAMLAHoliday('modalCreateTitle')}
          </Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAMLAHoliday('formDate')}
            </Typography>
            <FormSingleDatePicker
              {...fieldDate}
              placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAMLAHoliday('formHolidayName')}
            </Typography>
            <TextField
              {...fieldName}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'holiday name',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.holidayName)}
              helperText={errors.holidayName?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'flex-end'}
          sx={{ p: 2, flex: 1 }}
        >
          <AuthorizeView access="amla-holiday" privileges={['create', 'update']}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
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

export default CreateHolidayModal;
