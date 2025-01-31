// Cores
import { useEffect, useState } from 'react';

// Hooks & Utils
import { useCommunityOwner } from '@src/shared/context/CommunityOwnerContext';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { TextGetter } from '@woi/core';
import {
  useBankListFetcher,
  useMerchantCashoutInquiryFetcher,
  useMerchantCashoutPaymentFetcher,
  useMerchantFeeRateTypeListFetcher,
  useMerchantProfileFetcher,
} from '@woi/service/co';
import { useConfirmationDialog } from '@woi/web-component';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { PaginationData } from '@woi/core/api';
import { OptionMap } from '@woi/option';
import { CashoutInquiryRequest } from '@woi/service/co/merchant/merchantCashoutInquiry';
import { MerchantProfileResponse } from '@woi/service/co/merchant/merchantProfile';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { CashoutPaymentResponse } from '@woi/service/co/merchant/merchantCashoutPayment';

interface OptionMapBank<T> {
  label: string;
  value: T;
  bankCode: string;
  bankName: string;
}

export interface CashoutForm {
  bankName: OptionMapBank<string> | null;
  transferService: OptionMap<string> | null;
  password: string;
}

const initialCashoutForm: CashoutForm = {
  bankName: null,
  transferService: null,
  password: '',
};

export type CashoutMerchantUpsertProps = {
  showModal: () => void;
  hideModal: () => void;
  showModalPassword: () => void;
  hideModalPassword: () => void;
};

function useCashoutMerchantUpsert(props: CashoutMerchantUpsertProps) {
  const { showModal, hideModal, showModalPassword, hideModalPassword } = props;
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { merchantCode } = useCommunityOwner();
  const { getConfirmation } = useConfirmationDialog();
  const { t: tCommon } = useTranslation('common');
  const { t: tAccount } = useTranslation('account');

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [bankOptions, setBankOptions] = useState<OptionMap<string>[]>([]);
  const [feeRateTypeOptions, setFeeRateTypeOptions] = useState<
    OptionMap<string>[]
  >([]);
  const [merchantProfile, setMerchantProfile] =
    useState<MerchantProfileResponse | null>(null);
  const [paymentResult, setPaymentResult] =
    useState<CashoutPaymentResponse | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [payloadInquiry, setPayloadInquiry] =
    useState<CashoutInquiryRequest | null>(null);

  const formData = useForm<CashoutForm>({
    defaultValues: initialCashoutForm,
  });
  const { handleSubmit, reset } = formData;

  const fetchMerchantProfile = async () => {
    const { result, error } = await useMerchantProfileFetcher(
      baseUrl,
      merchantCode,
    );

    if (result && !error) {
      setMerchantProfile(result);
    }
  };

  const fetchBankList = async () => {
    const { result, error } = await useBankListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setBankOptions(
        result.data.map(data => ({
          label: `${data.name} (${data.fullName})`,
          value: data.id,
          bankCode: data.bankCode,
          bankName: data.name,
        })),
      );
    }
  };

  const fetchFeeRateTypeList = async () => {
    const { result, error } = await useMerchantFeeRateTypeListFetcher(baseUrl);

    if (result && !error) {
      setFeeRateTypeOptions(
        result.data.map(data => ({
          label: data.description,
          value: data.secureId,
        })),
      );
    }
  };

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancel', { text: 'Cashout' }),
      message: tCommon('confirmationCancelDescription'),
      primaryText: tCommon('confirmationCancelCreateYes'),
      secondaryText: tCommon('confirmationCancelTransaction'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error',
    });

    if (confirmed) {
      hideModal();
      reset();
      hideModalPassword();
    }
  };

  const handleConfirm = handleSubmit(async form => {
    setPayloadInquiry({
      accountNumber: TextGetter.getterString(merchantProfile?.accountNumber),
      bankCode: TextGetter.getterString(form.bankName?.bankCode),
      bankId: TextGetter.getterString(form.bankName?.value),
      bankName: TextGetter.getterString(form.bankName?.bankName),
      merchantCode: merchantCode,
    });

    showModal();
  });

  const handleRequest = async () => {
    setLoading(true);
    if (payloadInquiry) {
      const { result, error } = await useMerchantCashoutInquiryFetcher(
        baseUrl,
        payloadInquiry,
      );
      if (!result?.failure && !error) {
        showModalPassword();
        hideModal();
      }
    }
    setLoading(false);
  };

  const handleUpsert = handleSubmit(async form => {
    setLoading(true);
    const { result, error } = await useMerchantCashoutPaymentFetcher(baseUrl, {
      accountName: '',
      accountNumber: TextGetter.getterString(merchantProfile?.accountNumber),
      amount: TextGetter.getterNumber(merchantProfile?.balance),
      bankCode: TextGetter.getterString(form.bankName?.bankCode),
      bankId: TextGetter.getterString(form.bankName?.value),
      bankName: TextGetter.getterString(form.bankName?.bankName),
      description: '',
      merchantCode: merchantCode,
      methodTransferCode: TextGetter.getterString(form.bankName?.bankCode),
    });

    if (result && !error) {
      setPaymentResult(result);
      hideModalPassword();
    } else {
      enqueueSnackbar(tAccount('detailPassword'), { variant: 'info' });
    }
    setLoading(false);
  });

  useEffect(() => {
    fetchMerchantProfile();
    fetchBankList();
    fetchFeeRateTypeList();
  }, []);

  return {
    pagination,
    setPagination,
    bankOptions,
    feeRateTypeOptions,
    handleConfirm,
    formData,
    merchantProfile,
    isLoading,
    handleRequest,
    showModal,
    hideModal,
    handleCancel,
    hideModalPassword,
    handleUpsert,
    paymentResult,
  };
}

export default useCashoutMerchantUpsert;
