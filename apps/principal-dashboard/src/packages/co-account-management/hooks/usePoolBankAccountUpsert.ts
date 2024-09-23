import { useEffect, useState } from "react";

import { CommunityOwnerBankAccount } from "@woi/communityOwner";
import { OptionMap } from "@woi/option";

// Hooks
import { useSnackbar } from 'notistack';
import { useForm } from "react-hook-form";
import { useBankListFetcher, useCurrencyListFetcher, useReferralListFetcher } from "@woi/service/principal";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useConfirmationDialog } from "@woi/web-component";
import { useTranslation } from "react-i18next";

interface PoolBankAccountUpsertProps {
  selectedData: CommunityOwnerBankAccount | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerBankAccount) => void;
}

function usePoolBankAccountUpsert(props: PoolBankAccountUpsertProps) {
  const { selectedData, onSubmit, onHide } = props;
  const formData = useForm<CommunityOwnerBankAccount>({
    defaultValues: selectedData || {
      bankId: null,
      bin: '',
      currencyId: null,
      fundType: null,
      name: '',
      number: '',
      vaLength: '',
    },
  });
  const { handleSubmit } = formData;
  const [bankOptions, setBankOptions] = useState<OptionMap<string>[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<OptionMap<string>[]>([]);
  const [fundTypeOptions, setFundTypeOptions] = useState<OptionMap<string>[]>([]);
  const { baseUrl } = useBaseUrl();
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = handleSubmit((form) => {
    enqueueSnackbar(tCommon('successAdd', { text: 'Bank' }), {
      variant: 'success',
    });
    onSubmit(form);
  })

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelTitle', { text: 'Create Community Owner' }),
      message: tCommon('confirmationCancelDescription'),
      primaryText: tCommon('confirmationCancelYes'),
      secondaryText: tCommon('confirmationCancelNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      onHide();
    }
  }

  const fetchBankList = async () => {
    const { result, error } = await useBankListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setBankOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })))
    }
  }

  const fetchCurrencyList = async () => {
    const { result, error } = await useCurrencyListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setCurrencyOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })))
    }
  }

  const fetchFundTypeList = async () => {
    const { result, error } = await useReferralListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
      type: 'FUND_TYPE'
    });

    if (result && !error) {
      setFundTypeOptions(result.data.map(data => ({
        label: data.code,
        value: data.value,
      })))
    }
  }

  useEffect(() => {
    fetchBankList();
    fetchCurrencyList();
    fetchFundTypeList();
  }, [])

  return {
    fundTypeOptions,
    bankOptions,
    currencyOptions,
    formData,
    handleSave,
    handleCancel,
  }
}

export default usePoolBankAccountUpsert;