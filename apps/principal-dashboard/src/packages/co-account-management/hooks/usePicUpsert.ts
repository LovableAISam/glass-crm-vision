import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { CommunityOwnerUserPIC } from "@woi/communityOwner";
import { PasswordGenerator } from "@woi/core";
import { OptionMap } from "@woi/option";
import { useCommunityOwnerPICLockFetcher, useRoleListFetcher } from "@woi/service/principal";
import { useConfirmationDialog } from "@woi/web-component";

// Hooks
import { useSnackbar } from 'notistack';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface PICUpsertProps {
  selectedData: CommunityOwnerUserPIC | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerUserPIC) => void;
}

function usePICUpsert(props: PICUpsertProps) {
  const { selectedData, onSubmit, onHide } = props;
  const formData = useForm<CommunityOwnerUserPIC>({
    defaultValues: selectedData || {
      username: '',
      password: '',
      passwordConfirm: '',
      role: null,
      isLocked: false,
      activeDate: null,
      inactiveDate: null,
    },
  });
  const { handleSubmit, setValue, getValues } = formData;
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const [roleOptions, setRoleOptions] = useState<OptionMap<string>[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = handleSubmit((form) => {
    enqueueSnackbar(tCommon('successAdd', { text: 'User PIC' }), {
      variant: 'success',
    });
    onSubmit(form);
  })

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelTitle', { text: 'Create User PIC' }),
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

  const handleLockUnlock = async () => {
    const isLocked = getValues('isLocked');

    const confirmed = await getConfirmation(isLocked ? {
      title: tCommon('confirmationUnlockTitle', { text: 'PIC Community Owner' }),
      message: tCommon('confirmationUnlockDescription', { text: 'PIC community owner' }),
      primaryText: tCommon('confirmationUnlockYes'),
      secondaryText: tCommon('confirmationUnlockNo'),
    } : {
      title: tCommon('confirmationLockTitle', { text: 'PIC Community Owner' }),
      message: tCommon('confirmationLockDescription', { text: 'PIC community owner' }),
      primaryText: tCommon('confirmationLockYes'),
      secondaryText: tCommon('confirmationLockNo'),
    });

    if (confirmed) {
      const { error } = await useCommunityOwnerPICLockFetcher(baseUrl, getValues('id'), {
        isLock: !isLocked
      })
      if (!error) {
        enqueueSnackbar(isLocked
          ? tCommon('successUnlock', { text: 'PIC Community Owner' })
          : tCommon('successLock', { text: 'PIC Community Owner' }
          ), { variant: 'info' });
        onSubmit({
          ...getValues(),
          isLocked: !isLocked
        });
        onHide();
      } else {
        enqueueSnackbar(isLocked
          ? tCommon('failedUnlock', { text: 'PIC Community Owner' })
          : tCommon('failedLock', { text: 'PIC Community Owner' }
          ), { variant: 'error' });
      }
    }
  }

  const handleGeneratePassword = () => {
    const password = PasswordGenerator.getPasswordGenerator()
    setValue('password', password)
    setValue('passwordConfirm', password)
  }

  const fetchRoleList = async () => {
    const { result, error } = await useRoleListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      const roleOptionsTemp = result.data.map(data => ({
        label: data.name,
        value: data.id,
      }))
      setRoleOptions(roleOptionsTemp);
      const selectedRole = roleOptionsTemp.find(roleOption => roleOption.label === 'system_admin');
      if (!getValues('role') && selectedRole) {
        setValue('role', selectedRole);
      }
    }
  }

  useEffect(() => {
    fetchRoleList();
  }, [])

  return {
    roleOptions,
    formData,
    handleSave,
    handleGeneratePassword,
    handleCancel,
    handleLockUnlock,
  }
}

export default usePICUpsert;