// Cores
import { useMutation, useQuery } from "@tanstack/react-query";

// Hooks & Utils
import {
  useAccountRuleDeleteFetcher,
  useAccountRuleUpdateFetcher,
  useAccountRuleCreateFetcher,
  useAccountRuleDetailFetcher
} from "@woi/service/principal";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { useForm } from 'react-hook-form';
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useTranslation } from "react-i18next";

export interface AccountRuleForm {
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}

const initialAccountRuleForm: AccountRuleForm = {
  code: '',
  name: '',
  description: '',
  isActive: false,
}

interface AccountRuleUpsertProps {
  selectedData: any | null;
  onHide: () => void;
  fetchAccountRuleList: () => void;
}

function useAccountRuleUpsert(props: AccountRuleUpsertProps) {
  const { selectedData, onHide, fetchAccountRuleList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();

  const formData = useForm<AccountRuleForm>({
    defaultValues: initialAccountRuleForm,
  });
  const { handleSubmit, setValue, getValues } = formData;
  const { t: tCommon } = useTranslation('common');

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'Account Rule' }),
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
      title: tCommon('confirmationDeactivateTitle', { text: 'Account Rule' }),
      message: tCommon('confirmationDeactivateDescription', { text: 'Account Rule' }),
      primaryText: tCommon('confirmationDeactivateYes'),
      secondaryText: tCommon('confirmationDeactivateNo'),
    } : {
      title: tCommon('confirmationActivateTitle', { text: 'Account Rule' }),
      message: tCommon('confirmationActivateDescription', { text: 'Account Rule' }),
      primaryText: tCommon('confirmationActivateYes'),
      secondaryText: tCommon('confirmationActivateNo'),
    });

    if (confirmed) {
      enqueueSnackbar(isActive
        ? tCommon('successDeactivate', { text: 'User' })
        : tCommon('successActivate', { text: 'User' }
        ), { variant: 'info' });
    }
  }

  const { mutate: mutateAccountRuleCreate } = useMutation(
    async (form: AccountRuleForm) => await useAccountRuleCreateFetcher(baseUrl, {
      code: form.code,
      name: form.name,
      description: form.description,
    }),
    {
      onSuccess: (response) => {
        const { error, errorData } = response;
        if (!error) {
          enqueueSnackbar(tCommon('successAdd', { text: 'Account rule' }), { variant: 'success' });
          onHide();
          fetchAccountRuleList();
        } else {
          enqueueSnackbar(errorData?.details?.[0] || tCommon('failedCreate', { text: 'Account rule' }), { variant: 'error' });
        }
      },
      onError: () => {
        enqueueSnackbar(tCommon('failedCreate', { text: 'Account rule' }), { variant: 'error' });
      }
    }
  );

  const { mutate: mutateAccountRuleUpdate } = useMutation(
    async (form: AccountRuleForm) => await useAccountRuleUpdateFetcher(baseUrl, selectedData.id, {
      code: form.code,
      name: form.name,
      description: form.description,
    }),
    {
      onSuccess: (response) => {
        const { error, errorData } = response;
        if (!error) {
          enqueueSnackbar(tCommon('successUpdate', { text: 'Account rule' }), { variant: 'success' });
          onHide();
          fetchAccountRuleList();
        } else {
          enqueueSnackbar(errorData?.details?.[0] || tCommon('failedUpdate', { text: 'Account rule' }), { variant: 'error' });
        }
      },
      onError: () => {
        enqueueSnackbar(tCommon('failedUpdate', { text: 'Account rule' }), { variant: 'error' });
      }
    }
  );

  const handleUpsert = handleSubmit(async (form) => {
    if (isUpdate) {
      const confirmed = await getConfirmation({
        title: tCommon('confirmationUpdateTitle', { text: 'Account Rule' }),
        message: tCommon('confirmationUpdateDescription', { text: 'Account Rule' }),
        primaryText: tCommon('confirmationUpdateYes'),
        secondaryText: tCommon('confirmationUpdateNo'),
      });
      if (confirmed) {
        mutateAccountRuleUpdate(form)
      }
    } else {
      const confirmed = await getConfirmation({
        title: tCommon('confirmationCreateTitle', { text: 'Account Rule' }),
        message: tCommon('confirmationCreateDescription', { text: 'Account Rule' }),
        primaryText: tCommon('confirmationCreateYes'),
        secondaryText: tCommon('confirmationCreateNo'),
      });
      if (confirmed) {
        mutateAccountRuleCreate(form)
      }
    }
  })

  const { status: accountRuleStatus } = useQuery(
    ['account-rule-detail'],
    async () => await useAccountRuleDetailFetcher(baseUrl, selectedData.id),
    {
      enabled: Boolean(selectedData?.id),
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const { result, error } = response;
        if (result && !error) {
          setValue('code', result.code);
          setValue('name', result.name);
          setValue('description', result.description);
        }
      },
    }
  );

  const { mutate: mutateAccountRuleDelete } = useMutation(
    async () => await useAccountRuleDeleteFetcher(baseUrl, selectedData.id),
    {
      onSuccess: (response) => {
        const { error, errorData } = response;
        if (!error) {
          enqueueSnackbar(tCommon('successDelete', { text: 'Account Rule' }), { variant: 'info' });
          onHide();
          fetchAccountRuleList();
        } else {
          enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: 'Account Rule' }), { variant: 'error' });
        }
      },
      onError: () => {
        enqueueSnackbar(tCommon('failedDelete', { text: 'Account Rule' }), { variant: 'error' });
      }
    }
  );

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'Account Rule' }),
      message: tCommon('confirmationDeleteDescription', { text: 'Account Rule' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      mutateAccountRuleDelete();
    }
  }

  return {
    formData,
    accountRuleStatus,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
  }
}

export default useAccountRuleUpsert;
