import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  Grid,
  Card,
  TextField,
  Autocomplete,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import useModalPassword from '@woi/common/hooks/useModalPassword';
import { NumberFormat, Token } from '@woi/web-component';
import { CorrectionDataForm } from '../hooks/useBalanceCorrectionList';
import { useController } from 'react-hook-form';
import ViewConfirmPasswordModal from './ViewConfirmPasswordModal';
import { MemberLockData } from '@woi/service/co/admin/member/memberLockList';
import { PriceConverter } from '@woi/core';
import { useRouter } from 'next/router';
import useBalanceCorrectionUppsert from '../hooks/useBalanceCorrectionUppsert';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import useDebounce from '@woi/common/hooks/useDebounce';

type ViewBalanceCorrectionModalProps = {
  isActive: boolean;
  onHide: () => void;
  selectedData: MemberLockData;
  privilegeType: string;
  fetchMemberList: () => void;
};

const ViewBalanceCorrectionModal = (props: ViewBalanceCorrectionModalProps) => {
  const { isActive, onHide, selectedData, privilegeType, fetchMemberList } =
    props;

  const router = useRouter();
  const [isActivePassword, showModalPassword, hideModalPassword] =
    useModalPassword();

  const { t: tForm } = useTranslation('form');
  const { t: tCommon } = useTranslation('common');
  const { t: tBalanceCorrection } = useTranslation('balanceCorrection');

  const { formData, actionOptions, handleSubmit } =
    useBalanceCorrectionUppsert();

  const {
    formState: { errors },
    control,
    setValue,
    getValues,
  } = formData;
  const [inputCorrection, setInputCorrection] =
    useState<CorrectionDataForm | null>(null);
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED'>(
    'APPROVED',
  );
  const debounceValue = useDebounce(getValues('amount'), 300);

  useEffect(() => {
    const actionValue = getValues('action')?.value;
    const isDeduct = actionValue === 'DEDUCT' && debounceValue !== '';
    const isTopup = actionValue === 'TOPUP' && debounceValue !== '';

    if (isDeduct) {
      setValue(
        'balance',
        `${selectedData.balance - parseFloat(debounceValue)}`,
      );
    } else if (isTopup) {
      setValue(
        'balance',
        `${selectedData.balance + parseFloat(debounceValue)}`,
      );
    } else {
      setValue('balance', '');
    }
  }, [debounceValue, getValues('action')]);

  const { field: fieldAction } = useController({
    name: 'action',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Action' }),
    },
  });

  const { field: fieldAmount } = useController({
    name: 'amount',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Amount' }),
      validate: value => {
        if (
          getValues('action')?.value === 'DEDUCT' &&
          parseFloat(value) > selectedData.balance
        ) {
          return tBalanceCorrection('generalErrorMin', { number: 8 });
        }
      },
    },
  });

  const { field: fieldBalance } = useController({
    name: 'balance',
    control,
  });

  const { field: fieldReason } = useController({
    name: 'reason',
    control,
    rules: {
      validate: value => {
        if (!value && actionType === 'REJECTED') {
          return tForm('generalErrorRequired', { fieldName: 'Reason' });
        }
      },
    },
  });

  useEffect(() => {
    if (privilegeType !== 'REQUESTER') {
      setValue('action', {
        label:
          selectedData?.type === 'DEDUCT'
            ? tBalanceCorrection('optionDeduct')
            : tBalanceCorrection('optionTopUp'),
        //@ts-ignore
        value: selectedData?.type || '',
      });
      setValue('amount', JSON.stringify(selectedData.amount));
      setValue('balance', JSON.stringify(selectedData.balanceAfter));
    }
  }, [selectedData]);

  const handleUpsert = handleSubmit(async form => {
    setInputCorrection(form);
    showModalPassword();
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
            {tBalanceCorrection('detailTitle')}
          </Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tBalanceCorrection('detailVANumber')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                  {selectedData.phoneNumber}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tBalanceCorrection('detailVAName')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                  {selectedData.name}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tBalanceCorrection('detailBalance')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                  {PriceConverter.formatPrice(
                    selectedData.balance,
                    router.locale,
                  )}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailAction')}
            </Typography>
            <Autocomplete
              {...fieldAction}
              disabled={privilegeType !== 'REQUESTER'}
              onChange={(_, value) => fieldAction.onChange(value)}
              options={actionOptions}
              fullWidth
              autoComplete={false}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'action',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.action)}
                  helperText={errors.action?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailAmountToCorrect')}
            </Typography>
            <TextField
              {...fieldAmount}
              disabled={privilegeType !== 'REQUESTER'}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'amount',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailBalanceCorrected')}
            </Typography>
            <TextField
              {...fieldBalance}
              fullWidth
              disabled
              placeholder={tForm('placeholderType', {
                fieldName: 'amount',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.balance)}
              helperText={errors.balance?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailReason')}
            </Typography>
            <TextField
              {...fieldReason}
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              placeholder={tForm('placeholderType', {
                fieldName: 'reason',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.reason)}
              helperText={errors.reason?.message}
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
          {privilegeType === 'REQUESTER' ? (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
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
                onClick={handleUpsert}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tCommon('actionSave')}
              </Button>
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                onClick={() => {
                  setActionType('APPROVED');
                  handleUpsert();
                }}
                sx={{
                  py: 1,
                  px: 5,
                  borderRadius: 2,
                  display: privilegeType !== 'REQUESTER' ? 'inherit' : 'none',
                }}
              >
                {tCommon('actionApprove')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setActionType('REJECTED');
                  handleUpsert();
                }}
                sx={{
                  py: 1,
                  px: 5,
                  borderRadius: 2,
                  display: privilegeType !== 'REQUESTER' ? 'inherit' : 'none',
                }}
              >
                {tCommon('actionReject')}
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogActions>

      <ViewConfirmPasswordModal
        isActive={isActivePassword}
        onHide={hideModalPassword}
        selectedData={selectedData}
        correctionData={inputCorrection}
        onHideModal={onHide}
        actionType={actionType}
        privilegeType={privilegeType}
        fetchMemberList={fetchMemberList}
      />
    </Dialog>
  );
};

export default ViewBalanceCorrectionModal;
