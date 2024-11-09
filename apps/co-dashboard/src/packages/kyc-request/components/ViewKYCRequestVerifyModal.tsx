import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Stack,
  Typography,
  IconButton,
  DialogActions,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Card,
  useTheme,
} from '@mui/material';
import { Button } from '@woi/web-component';
import { KycPremiumMemberStatus } from '@woi/service/co/kyc/premiumMember/premiumMemberList';
import { useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';

export type VerifyForm = {
  reason: string;
  status: KycPremiumMemberStatus;
};

const initialVerifyForm: VerifyForm = {
  reason: '',
  status: 'REGISTERED',
};

type ViewKYCRequestVerifyModalProps = {
  isActive: boolean;
  onHide: () => void;
  onSubmit: (form: VerifyForm) => void;
};

const ViewKYCRequestVerifyModal = (props: ViewKYCRequestVerifyModalProps) => {
  const { isActive, onHide, onSubmit } = props;
  const theme = useTheme();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<VerifyForm>({
    defaultValues: initialVerifyForm,
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tForm } = useTranslation('form');

  const { field: fieldStatus } = useController({
    name: 'status',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'status' }),
    },
  });

  const { field: fieldReason } = useController({
    name: 'reason',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'reason' }),
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
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">{tKYC('modalVerifyTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">
                {tKYC('verificationTitle')}
              </Typography>
              <FormControl
                component="fieldset"
                variant="standard"
                sx={{ width: '100%' }}
              >
                <RadioGroup
                  {...fieldStatus}
                  onChange={(_, value) => fieldStatus.onChange(value)}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value={'REGISTERED' as KycPremiumMemberStatus}
                    control={<Radio />}
                    label={tKYC('actionApproveKYC')}
                  />
                  <FormControlLabel
                    value={'REJECTED' as KycPremiumMemberStatus}
                    control={<Radio />}
                    label={tKYC('actionRejectKYC')}
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
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
                <div
                  dangerouslySetInnerHTML={{ __html: tKYC('verificationInfo') }}
                />
              </Typography>
            </Card>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">
                {tKYC('verificationReason')}
              </Typography>
              <TextField
                {...fieldReason}
                fullWidth
                placeholder={tForm('placeholderSelect', {
                  fieldName: 'reason of KYC approval/rejection',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                multiline
                rows={3}
                error={Boolean(errors.reason)}
                helperText={errors.reason?.message}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ p: 2 }}
        >
          <Button
            variant="outlined"
            onClick={onHide}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >
            {tCommon('actionCancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >
            {tCommon('actionSubmit')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewKYCRequestVerifyModal;
