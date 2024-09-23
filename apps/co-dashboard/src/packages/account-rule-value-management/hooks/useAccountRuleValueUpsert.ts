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
} from "@woi/service/co";
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
import { AccountRuleValueUpdateRequest } from "@woi/service/co/admin/accountRuleValue/accountRuleValueUpdate";
import { AccountRuleValueCreateRequest } from "@woi/service/co/admin/accountRuleValue/accountRuleValueCreate";

export interface AccountRuleValueForm {
  accountRuleId: OptionMap<string> | null;
  transactionType: OptionMap<string> | null;
  valueRegisterMember: number | null;
  valueUnregisterMember: number | null;
  valueProMember: number | null;
  currency: OptionMap<string> | null;
  effectiveDate: DatePeriod;
}

const initialAccountRuleValueForm: AccountRuleValueForm = {
  accountRuleId: null,
  transactionType: null,
  valueRegisterMember: null,
  valueUnregisterMember: null,
  valueProMember: null,
  currency: null,
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

interface AccountRuleValueUpsertProps {
  selectedData: any | null;
  onHide: () => void;
  fetchAccountRuleValueList: () => void;
}

function useAccountRuleValueUpsert(props: AccountRuleValueUpsertProps) {
  const { t: tCommon } = useTranslation('common');
  const { selectedData, onHide, fetchAccountRuleValueList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();

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
  };

  const { data: transactionTypeData } = useQuery(
    ['transaction-type-list'],
    async () => useTransactionTypeOptionListFetcher(baseUrl, {
      target: 'EXCLUDE_USED_TRANSACTION_TYPE',
    }),
    { refetchOnWindowFocus: false }
  );

  const transactionTypeOptions = useMemo(() => {
    if (!transactionTypeData) return [];
    return Object.entries(transactionTypeData.result || {}).map(([key, value]) => ({
      label: value,
      value: key
    }));
  }, [transactionTypeData]);

  const { data: accountRuleData } = useQuery(
    ['account-rule-list'],
    async () => useAccountRuleOptionListFetcher(baseUrl, {
      target: 'EXCLUDE_USED_ACCOUNT_RULE',
    }),
    { refetchOnWindowFocus: false }
  );

  const accountRuleOptions = useMemo(() => {
    if (!accountRuleData) return [];
    return Object.entries(accountRuleData.result || {}).map(([key, value]) => ({
      label: value,
      value: key
    }));
  }, [accountRuleData]);

  const { data: currencyData } = useQuery(
    ['currency-list'],
    async () => useCurrencyListFetcher(baseUrl, {
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
    }));
  }, [currencyData]);

  const { mutate: mutateAccountRuleValueCreate } = useMutation(
    async (form: AccountRuleValueCreateRequest) => useAccountRuleValueCreateFetcher(baseUrl, form),
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
    async (form: AccountRuleValueUpdateRequest) => useAccountRuleValueUpdateFetcher(baseUrl, selectedData.id, form),
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
    if (isUpdate) {
      const confirmed = await getConfirmation({
        title: tCommon('confirmationUpdateTitle', { text: 'Account Rule Value' }),
        message: tCommon('confirmationUpdateDescription', { text: 'Account Rule Value' }),
        primaryText: tCommon('confirmationUpdateYes'),
        secondaryText: tCommon('confirmationUpdateNo'),
      });
      if (confirmed) {
        mutateAccountRuleValueUpdate({
          accountRuleId: TextGetter.getterString(form.accountRuleId?.value),
          accountRuleName: TextGetter.getterString(form.accountRuleId?.label),
          currencyId: TextGetter.getterString(form.currency?.value),
          currencyName: TextGetter.getterString(form.currency?.label),
          transactionTypeId: TextGetter.getterString(form.transactionType?.value),
          transactionTypeName: TextGetter.getterString(form.transactionType?.label),
          valueRegisterMember: TextGetter.getterNumber(form.valueRegisterMember),
          valueUnregisterMember: TextGetter.getterNumber(form.valueUnregisterMember),
          valueProMember: TextGetter.getterNumber(form.valueProMember),
          startDate: stringToDateFormat(form.effectiveDate.startDate),
          endDate: stringToDateFormat(form.effectiveDate.endDate),
        });
      }
    } else {
      const confirmed = await getConfirmation({
        title: tCommon('confirmationCreateTitle', { text: 'Account Rule Value' }),
        message: tCommon('confirmationCreateDescription', { text: 'Account Rule Value' }),
        primaryText: tCommon('confirmationCreateYes'),
        secondaryText: tCommon('confirmationCreateNo'),
      });
      if (confirmed) {
        mutateAccountRuleValueCreate({
          accountRuleId: TextGetter.getterString(form.accountRuleId?.value),
          accountRuleName: TextGetter.getterString(form.accountRuleId?.label),
          currencyId: TextGetter.getterString(form.currency?.value),
          currencyName: TextGetter.getterString(form.currency?.label),
          transactionTypeId: TextGetter.getterString(form.transactionType?.value),
          transactionTypeName: TextGetter.getterString(form.transactionType?.label),
          valueRegisterMember: TextGetter.getterNumber(form.valueRegisterMember),
          valueUnregisterMember: TextGetter.getterNumber(form.valueUnregisterMember),
          valueProMember: TextGetter.getterNumber(form.valueProMember),
          startDate: stringToDateFormat(form.effectiveDate.startDate),
          endDate: stringToDateFormat(form.effectiveDate.endDate),
        });
      }
    }
  });

  const { status: accountRuleStatus } = useQuery(
    ['account-rule-value-detail'],
    async () => useAccountRuleValueDetailFetcher(baseUrl, selectedData.id),
    {
      enabled: Boolean(selectedData?.id),
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const { result, error } = response;
        if (result && !error) {
          setValue('accountRuleId', { label: result.accountRuleName, value: result.accountRuleSecureId });
          setValue('valueRegisterMember', result.valueRegisterMember);
          setValue('valueUnregisterMember', result.valueUnregisterMember);
          setValue('valueProMember', result.valueProMember);
          setValue('transactionType', { label: result.transactionTypeName, value: result.transactionTypeSecureId });
          setValue('currency', { label: result.currencyName, value: result.currencySecureId });
          setValue('effectiveDate', {
            startDate: result.startDate ? new Date(result.startDate) : null,
            endDate: result.endDate ? new Date(result.endDate) : null
          });
        }
      },
    }
  );

  const { mutate: mutateAccountRuleValueDelete } = useMutation(
    async () => useAccountRuleValueDeleteFetcher(baseUrl, selectedData.id),
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
      secondaryText: tCommon('confirmationCancelNo')
    });

    if (confirmed) {
      mutateAccountRuleValueDelete();
    }
  };

  return {
    currencyOptions,
    accountRuleOptions,
    transactionTypeOptions,
    formData,
    accountRuleStatus,
    handleUpsert,
    handleDelete,
    handleCancel,
  };
}

export default useAccountRuleValueUpsert;
