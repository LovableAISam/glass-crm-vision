// Cores
import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// Hooks & Utils
import {
  useAccountRuleOptionListFetcher,
  useAccountRuleValueDeleteFetcher,
  useAccountRuleValueUpdateFetcher,
  useAccountRuleValueCreateFetcher,
  useAccountRuleValueDetailFetcher,
  useTransactionTypeOptionListFetcher,
  useCurrencyListFetcher
} from "@woi/service/principal";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { useForm } from 'react-hook-form';
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useTranslation } from "react-i18next";

// Types & Consts
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";
import { TextGetter } from "@woi/core";
import { AccountRuleValueUpdateRequest } from "@woi/service/principal/admin/accountRuleValue/accountRuleValueUpdate";
import { AccountRuleValueCreateRequest } from "@woi/service/principal/admin/accountRuleValue/accountRuleValueCreate";

export interface AccountRuleValueForm {
  accountRulesId: OptionMap<string> | null;
  transactionType: OptionMap<string> | null;
  valueRegisterMember: number | null;
  valueUnregisterMember: number | null;
  currency: OptionMap<string> | null;
  effectiveDate: DatePeriod;
}

const initialAccountRuleValueForm: AccountRuleValueForm = {
  accountRulesId: null,
  transactionType: null,
  valueRegisterMember: null,
  valueUnregisterMember: null,
  currency: null,
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
}

interface AccountRuleValueUpsertProps {
  selectedData: any | null;
  onHide: () => void;
  fetchAccountRuleValueList: () => void;
}

function useAccountRuleValueUpsert(props: AccountRuleValueUpsertProps) {
  const { selectedData, onHide, fetchAccountRuleValueList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');

  const formData = useForm<AccountRuleValueForm>({
    defaultValues: initialAccountRuleValueForm,
  });
  const { handleSubmit, setValue } = formData;

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'Account Rule Value' }),
      message: tCommon('confirmationCancelCreateDescription'),
      primaryText: tCommon('confirmationCancelCreateYes'),
      secondaryText: tCommon('confirmationCancelCreateNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      onHide();
    }
  }

  const { data: transactionTypeData } = useQuery(
    ['transaction-type-list'],
    async () => await useTransactionTypeOptionListFetcher(baseUrl, {
      target: 'EXCLUDE_USED_TRANSACTION_TYPE',
    }),
    { refetchOnWindowFocus: false }
  );

  const transactionTypeOptions = useMemo(() => {
    if (!transactionTypeData) return [];
    return Object.entries(transactionTypeData.result || {}).map(([key, value]) => ({
      label: value,
      value: key
    }))
  }, [transactionTypeData])

  const { data: accountRuleData } = useQuery(
    ['account-rule-list'],
    async () => await useAccountRuleOptionListFetcher(baseUrl, {
      excludeUsedAccountRule: true,
    }),
    { refetchOnWindowFocus: false }
  );

  const accountRuleOptions = useMemo(() => {
    if (!accountRuleData) return [];
    return Object.entries(accountRuleData.result || {}).map(([key, value]) => ({
      label: value,
      value: key
    }))
  }, [accountRuleData])

  const { data: currencyData } = useQuery(
    ['currency-list'],
    async () => await useCurrencyListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    }),
    { refetchOnWindowFocus: false }
  );

  const currencyOptions = useMemo(() => {
    if (!currencyData) return [];
    return (currencyData.result?.data || []).map(data => ({
      label: data.name,
      value: data.id,
    }))
  }, [currencyData])

  const { mutate: mutateAccountRuleValueCreate } = useMutation(
    async (form: AccountRuleValueCreateRequest) => await useAccountRuleValueCreateFetcher(baseUrl, form),
    {
      onSuccess: (response) => {
        const { error, errorData } = response;
        if (!error) {
          enqueueSnackbar(tCommon('successAdd', { text: 'Account Rule Value' }), { variant: 'info' });
          onHide();
          fetchAccountRuleValueList();
        } else {
          enqueueSnackbar(errorData?.details?.[0] || tCommon('failedCreate', { text: 'Account Rule Value' }), { variant: 'info' });
        }
      },
      onError: () => {
        enqueueSnackbar(tCommon('failedCreate', { text: 'Account Rule Value' }), { variant: 'info' });
      }
    }
  );

  const { mutate: mutateAccountRuleValueUpdate } = useMutation(
    async (form: AccountRuleValueUpdateRequest) => await useAccountRuleValueUpdateFetcher(baseUrl, selectedData.id, form),
    {
      onSuccess: (response) => {
        const { error, errorData } = response;
        if (!error) {
          enqueueSnackbar(tCommon('successUpdate', { text: 'Account Rule Value' }), { variant: 'info' });
          onHide();
          fetchAccountRuleValueList();
        } else {
          enqueueSnackbar(errorData?.details?.[0] || tCommon('failedUpdate', { text: 'Account Rule Value' }), { variant: 'info' });
        }
      },
      onError: () => {
        enqueueSnackbar(tCommon('failedUpdate', { text: 'Account Rule Value' }), { variant: 'info' });
      }
    }
  );

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation(isUpdate ? {
      title: tCommon('confirmationUpdateTitle', { text: 'Account Rule Value' }),
      message: tCommon('confirmationUpdateDescription', { text: 'Account Rule Value' }),
      primaryText: tCommon('confirmationUpdateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    } : {
      title: tCommon('confirmationCreateTitle', { text: 'Account Rule Value' }),
      message: tCommon('confirmationCreateDescription', { text: 'Account Rule Value' }),
      primaryText: tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationCreateNo'),
    });

    if (confirmed) {
      const payload: AccountRuleValueUpdateRequest = {
        accountRulesId: TextGetter.getterString(form.accountRulesId?.value),
        currencyId: TextGetter.getterString(form.currency?.value),
        transactionTypeId: TextGetter.getterString(form.transactionType?.value),
        valueRegisterMember: TextGetter.getterNumber(form.valueRegisterMember),
        valueUnregisterMember: TextGetter.getterNumber(form.valueUnregisterMember),
        startDate: stringToDateFormat(form.effectiveDate.startDate),
        endDate: stringToDateFormat(form.effectiveDate.endDate),
      }
      if (isUpdate) {
        mutateAccountRuleValueUpdate(payload);
      } else {
        mutateAccountRuleValueCreate(payload);
      }
    }
  })

  const { status: accountRuleStatus } = useQuery(
    ['account-rule-value-detail'],
    async () => await useAccountRuleValueDetailFetcher(baseUrl, selectedData.id),
    {
      enabled: Boolean(selectedData?.id),
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const { result, error } = response;
        if (result && !error) {
          if (result.accountRules) {
            setValue('accountRulesId', { label: result.accountRules.name, value: result.accountRules.id });
          }
          setValue('valueRegisterMember', result.valueRegisterMember);
          setValue('valueUnregisterMember', result.valueUnregisterMember);
          if (result.transactionType) {
            setValue('transactionType', { label: result.transactionType.name, value: result.transactionType.id });
          }
          if (result.currency) {
            setValue('currency', { label: result.currency.name, value: result.currency.id });
          }
          setValue('effectiveDate', {
            startDate: result.startDate ? new Date(result.startDate) : null,
            endDate: result.endDate ? new Date(result.endDate) : null
          });
        }
      },
    }
  );

  const { mutate: mutateAccountRuleValueDelete } = useMutation(
    async () => await useAccountRuleValueDeleteFetcher(baseUrl, selectedData.id),
    {
      onSuccess: (response) => {
        const { error, errorData } = response;
        if (!error) {
          enqueueSnackbar(tCommon('successDelete', { text: 'Account Rule Value' }), { variant: 'info' });
          onHide();
          fetchAccountRuleValueList();
        } else {
          enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: 'Account Rule Value' }), { variant: 'error' });
        }
      },
      onError: () => {
        enqueueSnackbar(tCommon('failedDelete', { text: 'Account Rule' }), { variant: 'error' });
      }
    }
  );

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'Account Rule Value' }),
      message: tCommon('confirmationDeleteDescription', { text: 'Account Rule Value' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      mutateAccountRuleValueDelete();
    }
  }

  return {
    currencyOptions,
    accountRuleOptions,
    transactionTypeOptions,
    formData,
    accountRuleStatus,
    handleUpsert,
    handleDelete,
    handleCancel,
  }
}

export default useAccountRuleValueUpsert;
