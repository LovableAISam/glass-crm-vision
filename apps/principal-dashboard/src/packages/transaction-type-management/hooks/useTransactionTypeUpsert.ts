import { useEffect, useState } from "react";
import { useTransactionTypeUpdateFetcher, useTransactionTypeCreateFetcher, useTransactionTypeDeleteFetcher } from "@woi/service/principal";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { useForm } from 'react-hook-form';
import { TransactionTypeData } from "@woi/service/principal/admin/transactionType/transactionTypeList";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useTranslation } from "react-i18next";

export interface TransactionTypeForm {
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}

const initialTransactionTypeForm: TransactionTypeForm = {
  code: '',
  name: '',
  description: '',
  isActive: false,
}

interface TransactionTypeUpsertProps {
  selectedData: TransactionTypeData | null;
  onHide: () => void;
  fetchTransactionTypeList: () => void;
}

function useTransactionTypeUpsert(props: TransactionTypeUpsertProps) {
  const { selectedData, onHide, fetchTransactionTypeList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const formData = useForm<TransactionTypeForm>({
    defaultValues: selectedData || initialTransactionTypeForm,
  });
  const { handleSubmit, setValue, getValues } = formData;
  const [loading, setLoading] = useState<boolean>(false);
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'Transaction Type' }),
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
      title: tCommon('confirmationDeactivateTitle', { text: 'Transaction Type' }),
      message: tCommon('confirmationDeactivateDescription', { text: 'Transaction Type' }),
      primaryText: tCommon('confirmationDeactivateYes'),
      secondaryText: tCommon('confirmationDeactivateNo'),
    } : {
      title: tCommon('confirmationActivateTitle', { text: 'Transaction Type' }),
      message: tCommon('confirmationActivateDescription', { text: 'Transaction Type' }),
      primaryText: tCommon('confirmationActivateYes'),
      secondaryText: tCommon('confirmationActivateNo'),
    });

    if (confirmed) {
      enqueueSnackbar(isActive
        ? tCommon('successDeactivate', { text: 'Transaction Type' })
        : tCommon('successActivate', { text: 'Transaction Type' }
        ), { variant: 'info' });
    }
  }

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation(isUpdate ? {
      title: tCommon('confirmationUpdateTitle', { text: 'Transaction Type' }),
      message: tCommon('confirmationUpdateDescription', { text: 'Transaction Type' }),
      primaryText: tCommon('confirmationUpdateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    } : {
      title: tCommon('confirmationCreateTitle', { text: 'Transaction Type' }),
      message: tCommon('confirmationCreateDescription', { text: 'Transaction Type' }),
      primaryText: tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationCreateNo'),
    });

    if (confirmed) {
      setLoading(true);
      const { error, errorData } = isUpdate
        ? await useTransactionTypeUpdateFetcher(baseUrl, selectedData!.id, {
          id: selectedData!.id,
          code: form.code,
          name: form.name,
          description: form.description,
        })
        : await useTransactionTypeCreateFetcher(baseUrl, {
          code: form.code,
          name: form.name,
          description: form.description,
        })
      if (!error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'Transaction Type' })
          : tCommon('successAdd', { text: 'Transaction Type' }
          ), { variant: 'info' });
        onHide();
        fetchTransactionTypeList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || isUpdate
          ? tCommon('failedUpdate', { text: 'Transaction Type' })
          : tCommon('failedCreate', { text: 'Transaction Type' }
          ), { variant: 'error' });
      }
      setLoading(false);
    }
  })

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'Transaction Type' }),
      message: tCommon('confirmationDeleteDescription', { text: 'Transaction Type' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useTransactionTypeDeleteFetcher(baseUrl, selectedData!.id)
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: 'Transaction Type' }), { variant: 'info' });
        onHide();
        fetchTransactionTypeList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: 'Transaction Type' }), { variant: 'error' });
      }
    }
  }

  useEffect(() => {
    if (selectedData) {
      setValue('code', selectedData.code);
      setValue('name', selectedData.name);
      setValue('description', selectedData.description);
    }
  }, [selectedData])

  return {
    formData,
    loading,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
  }
}

export default useTransactionTypeUpsert;