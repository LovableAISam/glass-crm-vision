import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { OptionMap } from "@woi/option";
import { useForm } from 'react-hook-form';
import { EmailContentData } from "@woi/service/co/admin/emailContent/emailContentList";
import {
  useEmailContentCreateFetcher,
  useEmailContentDeleteFetcher,
  useEmailContentDetailFetcher,
  useEmailContentUpdateFetcher,
  useTransactionTypeOptionListFetcher
} from "@woi/service/co";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

export interface EmailContentForm {
  subject: string;
  content: string;
  transactionTypeId: OptionMap<number | string> | null;
  isActive: boolean;
}

const initialEmailContentForm: EmailContentForm = {
  subject: '',
  content: '',
  transactionTypeId: null,
  isActive: false,
};

interface EmailContentUpsertProps {
  selectedData: EmailContentData | null;
  onHide: () => void;
  fetchEmailContentList: () => void;
}

function useEmailContentUpsert(props: EmailContentUpsertProps) {
  const { selectedData, onHide, fetchEmailContentList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');

  const formData = useForm<EmailContentForm>({
    defaultValues: initialEmailContentForm,
  });
  const { handleSubmit, setValue, getValues } = formData;

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'Email Content' }),
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
      title: tCommon('confirmationDeactivateTitle', { text: 'Email Content' }),
      message: tCommon('confirmationDeactivateDescription', { text: 'Email Content' }),
      primaryText: tCommon('confirmationDeactivateYes'),
      secondaryText: tCommon('confirmationDeactivateNo'),
    } : {
      title: tCommon('confirmationActivateTitle', { text: 'Email Content' }),
      message: tCommon('confirmationActivateDescription', { text: 'Email Content' }),
      primaryText: tCommon('confirmationActivateYes'),
      secondaryText: tCommon('confirmationActivateNo'),
    });

    if (confirmed) {
      enqueueSnackbar(isActive
        ? tCommon('successDeactivate', { text: 'Email Content' })
        : tCommon('successActivate', { text: 'Email Content' }
        ), { variant: 'info' });
      onHide();
    }
  };

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation({
      title: isUpdate
        ? tCommon('confirmationUpdateTitle', { text: 'Email Content' })
        : tCommon('confirmationCreateTitle', { text: 'Email Content' }),
      message: isUpdate
        ? tCommon('confirmationUpdateDescription', { text: 'Email Content' })
        : tCommon('confirmationCreateDescription', { text: 'Email Content' }),
      primaryText: isUpdate
        ? tCommon('confirmationUpdateYes')
        : tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    });

    if (confirmed) {
      const { error, errorData } = isUpdate
        ? await useEmailContentUpdateFetcher(baseUrl, selectedData!.id, {
          id: selectedData!.id,
          subject: form.subject,
          content: form.content,
          transactionTypeId: form.transactionTypeId?.value || null,
        })
        : await useEmailContentCreateFetcher(baseUrl, {
          subject: form.subject,
          content: form.content,
          transactionTypeId: form.transactionTypeId?.value || null,
        });
      if (!error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'Community Owner' })
          : tCommon('successAdd', { text: 'Community Owner' }
          ), { variant: 'success' });
        onHide();
        fetchEmailContentList();
      } else {
        let errorMessage;

        if (errorData?.details) {
          errorMessage = errorData.details[0];
        } else if (isUpdate) {
          errorMessage = tCommon('failedUpdate', { text: 'Community Owner' });
        } else {
          errorMessage = tCommon('failedCreate', { text: 'Community Owner' });
        }

        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    }
  });

  const { data: contentDetail } = useQuery(
    ['content-detail', selectedData?.id],
    async () => useEmailContentDetailFetcher(baseUrl, selectedData?.id || ''),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && !response.error) {
          setValue('subject', result.subject);
          setValue('content', result.content);
          setValue('transactionTypeId', { label: result.transactionType.name, value: result.transactionType.id });
        }
      },
    }
  );

  const { data: contentTypeList } = useQuery(
    ['type-list', selectedData?.id],
    async () => useTransactionTypeOptionListFetcher(baseUrl, {
      target: 'EMAIL',
    }),
  );

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'Email Content' }),
      message: tCommon('confirmationDeleteDescription', { text: 'Email Content' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationCancelNo')
    });

    if (confirmed) {
      const { error } = await useEmailContentDeleteFetcher(baseUrl, selectedData!.id);
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: 'Email Content' }), { variant: 'info' });
        onHide();
        fetchEmailContentList();
      } else {
        enqueueSnackbar(tCommon('failedDelete', { text: 'Email Content' }), { variant: 'error' });
      }
    }
  };

  return {
    emailContentTypeOptions: Object.entries(contentTypeList?.result || {}).map(([key, value]) => ({
      label: value,
      value: key
    })),
    formData,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
    contentDetail
  };
}

export default useEmailContentUpsert;