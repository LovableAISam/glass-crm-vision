import React from 'react';
import {
  Dialog,
  DialogContent,
  Stack,
  Typography,
  Grid,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MemberLockData } from '@woi/service/co/admin/member/memberLockList';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { PasswordInput, useConfirmationDialog } from '@woi/web-component';
import { CorrectionDataForm } from '../hooks/useBalanceCorrectionList';
import { useController } from 'react-hook-form';
import {
  useBalanceCorretionApprovalFetcher,
  useCreateBalanceCorretionFetcher,
} from '@woi/service/co';
import { useSnackbar } from 'notistack';
import useBalanceCorrectionUppsert from '../hooks/useBalanceCorrectionUppsert';

type ViewConfirmPasswordModalProps = {
  isActive: boolean;
  onHide: () => void;
  selectedData: MemberLockData;
  correctionData: CorrectionDataForm | null;
  onHideModal: () => void;
  actionType: 'APPROVED' | 'REJECTED';
  privilegeType: string;
  fetchMemberList: () => void;
};

const ViewConfirmPasswordModal = (props: ViewConfirmPasswordModalProps) => {
  const {
    isActive,
    onHide,
    selectedData,
    correctionData,
    onHideModal,
    actionType,
    privilegeType,
    fetchMemberList,
  } = props;

  const { baseUrl } = useBaseUrl();
  const { t: tForm } = useTranslation('form');
  const { t: tCommon } = useTranslation('common');
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { t: tBalanceCorrection } = useTranslation('balanceCorrection');

  const { formData, isLoading, setIsLoading } = useBalanceCorrectionUppsert();

  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    resetField,
  } = formData;

  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Password' }),
    },
  });

  const handleUpsert = handleSubmit(async form => {
    setIsLoading(true);
    const { error, errorData } =
      privilegeType === 'REQUESTER'
        ? await useCreateBalanceCorretionFetcher(baseUrl, {
            type: correctionData?.action?.value,
            phoneNumber: selectedData.phoneNumber,
            amountToCorrect: parseFloat(correctionData?.amount || '0'),
            password: form.password,
          })
        : await useBalanceCorretionApprovalFetcher(baseUrl, {
            action: actionType,
            balanceCorrectionId: selectedData.balanceCorrectionId,
            reason: correctionData?.reason || '',
            password: form.password,
            amountToCorrect: parseFloat(correctionData?.amount || '0'),
            type: correctionData?.action?.value,
          });

    if (!error) {
      if (privilegeType === 'REQUESTER') {
        enqueueSnackbar(tBalanceCorrection('successCreateBalanceCorrection'), {
          variant: 'info',
        });
      } else {
        if (actionType === 'REJECTED') {
          enqueueSnackbar(tBalanceCorrection('successReject'), {
            variant: 'info',
          });
        } else if (privilegeType === 'APPROVER 1') {
          enqueueSnackbar(tBalanceCorrection('successApprove1'), {
            variant: 'info',
          });
        } else {
          enqueueSnackbar(tBalanceCorrection('successApprove2'), {
            variant: 'info',
          });
        }
      }
      fetchMemberList();
      onHide();
      onHideModal();
    } else if (errorData?.details[0] == 'Password Do Not Match') {
      const confirmed = await getConfirmation({
        title: tCommon('failedPasswordTitle'),
        message: tCommon('failedPasswordMessage'),
        primaryText: tCommon('confirmationOK'),
        btnSecondaryColor: 'primary',
        disableBtnSecondary: true,
      });
      if (confirmed) {
        setValue('password', '');
      }
    } else {
      enqueueSnackbar(
        errorData?.details
          ? errorData?.details[0].charAt(0).toUpperCase() +
              errorData?.details[0].slice(1)
          : tCommon('failedUpdate', {
              text: tBalanceCorrection('titleBalanceCorrection'),
            }),
        { variant: 'info' },
      );
    }
    setIsLoading(false);
  });

  return (
    <Dialog
      open={isActive}
      onClose={() => {
        resetField('password');
        onHide();
      }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailPassword')}
            </Typography>
            <PasswordInput
              {...fieldPassword}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'password' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            variant="outlined"
            onClick={() => {
              resetField('password');
              onHide();
            }}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
            disabled={isLoading}
          >
            {tCommon('actionCancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleUpsert}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
            disabled={isLoading}
          >
            {tCommon('actionSubmit')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewConfirmPasswordModal;
