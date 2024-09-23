import { useEffect, useState } from "react";
import { useBankFAQDeleteFetcher, useBankFAQUpdateFetcher, useBankFAQCreateFetcher, useBankFAQDetailFetcher, useBankListFetcher } from "@woi/service/principal";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { OptionMap } from "@woi/option";
import { useForm } from 'react-hook-form';
import { BankFAQData } from "@woi/service/principal/admin/bankFAQ/bankFAQList";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { TextGetter } from "@woi/core";
import { useTranslation } from "react-i18next";

export interface BankFAQForm {
  header: string;
  content: string;
  bank: OptionMap<string> | null;
  isActive: boolean;
}

const initialBankFAQForm: BankFAQForm = {
  header: '',
  content: '',
  bank: null,
  isActive: false,
}

interface BankFAQUpsertProps {
  selectedData: BankFAQData | null;
  onHide: () => void;
  fetchBankFAQList: () => void;
}

function useBankFAQUpsert(props: BankFAQUpsertProps) {
  const { selectedData, onHide, fetchBankFAQList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const [bankOptions, setBankOptions] = useState<OptionMap<string>[]>([]);
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');

  const formData = useForm<BankFAQForm>({
    defaultValues: initialBankFAQForm,
  });
  const { handleSubmit, setValue, getValues } = formData;
  const [loading, setLoading] = useState<boolean>(false);

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'Bank FAQ' }),
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

  const handleActivateDeactivate = async () => {
    const isActive = getValues('isActive');

    const confirmed = await getConfirmation(isActive ? {
      title: tCommon('confirmationDeactivateTitle', { text: 'Bank FAQ' }),
      message: tCommon('confirmationDeactivateDescription', { text: 'Bank FAQ' }),
      primaryText: tCommon('confirmationDeactivateYes'),
      secondaryText: tCommon('confirmationDeactivateNo'),
    } : {
      title: tCommon('confirmationActivateTitle', { text: 'Bank FAQ' }),
      message: tCommon('confirmationActivateDescription', { text: 'Bank FAQ' }),
      primaryText: tCommon('confirmationActivateYes'),
      secondaryText: tCommon('confirmationActivateNo'),
    });

    if (confirmed) {
      enqueueSnackbar(isActive
        ? tCommon('successDeactivate', { text: 'Bank FAQ' })
        : tCommon('successActivate', { text: 'Bank FAQ' }
        ), { variant: 'info' });
    }
  }

  const fetchBankList = async () => {
    const { result, error } = await useBankListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    })

    if (result && !error) {
      setBankOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })))
    }
  }

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation(isUpdate ? {
      title: tCommon('confirmationUpdateTitle', { text: 'Bank FAQ' }),
      message: tCommon('confirmationUpdateDescription', { text: 'Bank FAQ' }),
      primaryText: tCommon('confirmationUpdateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    } : {
      title: tCommon('confirmationCreateTitle', { text: 'Bank FAQ' }),
      message: tCommon('confirmationCreateDescription', { text: 'Bank FAQ' }),
      primaryText: tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationCreateNo'),
    });

    if (confirmed) {
      const payload = {
        header: form.header,
        content: form.content,
        bank: TextGetter.getterString(form.bank?.value),
      }
      const { error, errorData } = isUpdate
        ? await useBankFAQUpdateFetcher(baseUrl, selectedData!.id, payload)
        : await useBankFAQCreateFetcher(baseUrl, payload)
      if (!error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'Bank FAQ' })
          : tCommon('successAdd', { text: 'Bank FAQ' }
          ), { variant: 'info' });
        onHide();
        fetchBankFAQList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || isUpdate
          ? tCommon('failedUpdate', { text: 'Bank FAQ' })
          : tCommon('failedCreate', { text: 'Bank FAQ' }
          ), { variant: 'info' });
      }
    }
  })

  const fetchUserDetail = async (id: string) => {
    setLoading(true);
    const { result, error } = await useBankFAQDetailFetcher(baseUrl, id);

    if (result && !error) {
      setValue('header', result.header);
      setValue('content', result.content);
      if (result.bank) {
        setValue('bank', { label: result.bank.name, value: result.bank.id });
      }
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'Bank FAQ' }),
      message: tCommon('confirmationDeleteDescription', { text: 'Bank FAQ' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useBankFAQDeleteFetcher(baseUrl, selectedData!.id)
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: 'Bank FAQ' }), { variant: 'info' });
        onHide();
        fetchBankFAQList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: 'Bank FAQ' }), { variant: 'error' });
      }
    }
  }

  useEffect(() => {
    if (selectedData) {
      fetchUserDetail(selectedData.id);
    }
  }, [selectedData])

  useEffect(() => {
    fetchBankList()
  }, [])

  return {
    bankOptions,
    formData,
    loading,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
  }
}

export default useBankFAQUpsert;