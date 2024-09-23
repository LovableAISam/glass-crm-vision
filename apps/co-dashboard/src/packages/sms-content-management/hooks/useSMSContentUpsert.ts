import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { OptionMap } from "@woi/option";
import { useForm } from 'react-hook-form';
import { SMSContentData } from "@woi/service/co/admin/smsContent/smsContentList";
import {
  useSMSContentCreateFetcher,
  useSMSContentDeleteFetcher,
  useSMSContentDetailFetcher,
  useSMSContentUpdateFetcher,
  useTransactionTypeOptionListFetcher
} from "@woi/service/co";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useTranslation } from "react-i18next";

export interface SMSContentForm {
  subject: string;
  content: string;
  transactionTypeId: OptionMap<number | string> | null;
  isActive: boolean;
}

const initialSMSContentForm: SMSContentForm = {
  subject: '',
  content: '',
  transactionTypeId: null,
  isActive: false,
};

interface SMSContentUpsertProps {
  selectedData: SMSContentData | null;
  onHide: () => void;
  fetchSMSContentList: () => void;
}

function useSMSContentUpsert(props: SMSContentUpsertProps) {
  const { selectedData, onHide, fetchSMSContentList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const [smsContentTypeOptions, setSMSContentTypeOptions] = useState<OptionMap<number | string>[]>([]);
  const { baseUrl } = useBaseUrl();

  const formData = useForm<SMSContentForm>({
    defaultValues: initialSMSContentForm,
  });
  const { handleSubmit, setValue, getValues } = formData;
  const [loading, setLoading] = useState<boolean>(false);
  const { t: tCommon } = useTranslation('common');

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'SMS Content' }),
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

  const handleActivateDeactivate = async () => {
    const isActive = getValues('isActive');

    const confirmed = await getConfirmation(isActive ? {
      title: tCommon('confirmationDeactivateTitle', { text: 'SMS Content' }),
      message: tCommon('confirmationDeactivateDescription', { text: 'SMS Content' }),
      primaryText: tCommon('confirmationDeactivateYes'),
      secondaryText: tCommon('confirmationDeactivateNo'),
    } : {
      title: tCommon('confirmationActivateTitle', { text: 'SMS Content' }),
      message: tCommon('confirmationActivateDescription', { text: 'SMS Content' }),
      primaryText: tCommon('confirmationActivateYes'),
      secondaryText: tCommon('confirmationActivateNo'),
    });

    if (confirmed) {
      enqueueSnackbar(isActive
        ? tCommon('successDeactivate', { text: 'SMS Content' })
        : tCommon('successActivate', { text: 'SMS Content' }
        ), { variant: 'info' });
    }
  };

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation(isUpdate ? {
      title: tCommon('confirmationUpdateTitle', { text: 'SMS Content' }),
      message: tCommon('confirmationUpdateDescription', { text: 'SMS Content' }),
      primaryText: tCommon('confirmationUpdateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    } : {
      title: tCommon('confirmationCreateTitle', { text: 'SMS Content' }),
      message: tCommon('confirmationCreateDescription', { text: 'SMS Content' }),
      primaryText: tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationCreateNo'),
    });

    if (confirmed) {
      const { error, errorData } = isUpdate
        ? await useSMSContentUpdateFetcher(baseUrl, selectedData!.id, {
          id: selectedData!.id,
          subject: form.subject,
          content: form.content,
          transactionTypeId: form.transactionTypeId?.value || null,
        })
        : await useSMSContentCreateFetcher(baseUrl, {
          subject: form.subject,
          content: form.content,
          transactionTypeId: form.transactionTypeId?.value || null,
        });
      if (!error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'SMS Content' })
          : tCommon('successAdd', { text: 'SMS Content' }
          ), { variant: 'info' });
        onHide();
        fetchSMSContentList();
      } else {
        let errorMessage;
        if (errorData?.details?.[0]) {
          errorMessage = errorData.details[0];
        } else if (isUpdate) {
          errorMessage = tCommon('failedUpdate', { text: 'SMS Content' });
        } else {
          errorMessage = tCommon('failedCreate', { text: 'SMS Content' });
        }
        enqueueSnackbar(errorMessage, { variant: 'info' });
      }
    }
  });

  const fetchUserDetail = async (id: string) => {
    setLoading(true);
    const { result, error } = await useSMSContentDetailFetcher(baseUrl, id);

    if (result && !error) {
      setValue('subject', result.subject);
      setValue('content', result.content);
      setValue('transactionTypeId', { label: result.transactionType.name, value: result.transactionType.id });
    }
    setLoading(false);
  };

  const fetchSMSContentType = async () => {
    const { result, error } = await useTransactionTypeOptionListFetcher(baseUrl, {
      target: 'SMS',
    });

    if (result && !error) {
      setSMSContentTypeOptions(Object.entries(result).map(([key, value]) => ({
        label: value,
        value: key
      })));
    }
  };

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'SMS Content' }),
      message: tCommon('confirmationDeleteDescription', { text: 'SMS Content' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useSMSContentDeleteFetcher(baseUrl, selectedData!.id);
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: 'SMS Content' }), { variant: 'info' });
        onHide();
        fetchSMSContentList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: 'SMS Content' }), { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (selectedData) {
      fetchUserDetail(selectedData.id);
    }
  }, [selectedData]);

  useEffect(() => {
    fetchSMSContentType();
  }, []);

  return {
    smsContentTypeOptions,
    formData,
    loading,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
  };
}

export default useSMSContentUpsert;