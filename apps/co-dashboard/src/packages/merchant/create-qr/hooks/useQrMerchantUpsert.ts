// Cores
import { useEffect, useState } from 'react';

// Hooks & Utils
import { useCommunityOwner } from '@src/shared/context/CommunityOwnerContext';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { TextGetter } from '@woi/core';
import { useCreateQrTypeListFetcher, useMerchantProfileFetcher, useQRDynamicStatusFetcher, useQRDynamicUpdateFetcher } from '@woi/service/co';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

// Types & Consts
import { MerchantProfileResponse } from '@woi/service/co/merchant/merchantProfile';
import { QRDynamicStatusResponse } from "@woi/service/co/merchant/merchantQRDynamicStatus";

export interface CashoutForm {
  amount: number | null;
}

const initialCashoutForm: CashoutForm = {
  amount: null,
};

const initialDataStatus: QRDynamicStatusResponse = {
  amount: 0,
  cpan: '',
  date: '',
  issuerName: '',
  mpan: '',
  status: '',
  rrn: '',
};

type QrMerchantUpsertProps = {
  showModalQR: () => void;
  hideModalQR: () => void;
  showModalStatus: () => void;
  hideModalStatus: () => void;
};

function useQrMerchantUpsert(props: QrMerchantUpsertProps) {
  const { showModalQR, showModalStatus, hideModalQR, hideModalStatus } = props;
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { merchantCode } = useCommunityOwner();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [dataStatus, setDataStatus] = useState<QRDynamicStatusResponse>(initialDataStatus);
  const [qrString, setQrString] = useState<string>('');
  const [validityPeriod, setValidityPeriod] = useState<string>('');
  const [errorDialog, setErrorDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfileResponse | null>(null);

  const formData = useForm<CashoutForm>({
    defaultValues: initialCashoutForm,
  });
  const { handleSubmit, getValues } = formData;

  const fetchMerchantProfile = async () => {
    const { result, error } = await useMerchantProfileFetcher(
      baseUrl,
      merchantCode,
    );
    if (result && !error) {
      setMerchantProfile(result);
    }
  };

  const handleGenerate = handleSubmit(async form => {
    const amount = TextGetter.getterNumber(form.amount);

    try {
      setLoading(true);
      const { result, error, errorData } = await useCreateQrTypeListFetcher(
        baseUrl,
        amount,
        merchantCode,
      );
      setLoading(false);
      if (result && !error) {
        setQrString(result.qrString);
        setValidityPeriod(result.validityPeriod);
        showModalQR();
      } else if (errorData?.status?.code === '239') {
        setErrorDialog(true);
        setDialogMessage(errorData?.status?.text || '');
      } else {
        enqueueSnackbar(errorData?.status?.text || errorData?.message || errorData?.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  const updateStatus = async () => {
    setLoading(true);
    const { result } = await useQRDynamicUpdateFetcher(baseUrl, { qrCode: qrString, qrStatus: dataStatus?.status?.toLowerCase() === "open" ? "IN_PROGRESS" : 'IN_PROGRESS' });

    if (result?.status) {
      setTimeout(() => {
        setLoading(false);
        checkStatus();
      }, 1500);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    const { result, error, errorData } = await useQRDynamicStatusFetcher(baseUrl, {
      amount: TextGetter.getterNumber(getValues('amount')),
      merchantCode: merchantCode,
      qrString: qrString
    });
    setLoading(false);

    if (result && !error) {
      setDataStatus(result);
      showModalStatus();
      hideModalQR();
    } else {
      enqueueSnackbar(errorData?.status?.text || errorData?.message, { variant: 'error' });
    }
  };

  const handleReset = () => {
    setDataStatus(initialDataStatus);
    hideModalQR();
    hideModalStatus();
  };

  useEffect(() => {
    fetchMerchantProfile();
  }, [merchantCode]);

  return {
    handleGenerate,
    formData,
    merchantProfile,
    isLoading,
    showModalQR,
    qrString,
    validityPeriod,
    checkStatus,
    dataStatus,
    dialogMessage,
    errorDialog,
    setErrorDialog,
    updateStatus,
    handleReset
  };
}

export default useQrMerchantUpsert;
