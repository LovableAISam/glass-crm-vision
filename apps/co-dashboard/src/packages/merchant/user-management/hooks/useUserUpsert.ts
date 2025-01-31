import { useCommunityOwner } from "@src/shared/context/CommunityOwnerContext";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { PasswordGenerator, TextGetter } from "@woi/core";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";
import {
  useMerchantCreateUser,
  useMerchantUserDetailFetcher,
  useMerchantUserUpdateFetcher,
  useUserActivationFetcher,
  useUserActivationLockFetcher,
  useUserDeleteFetcher
} from "@woi/service/co";
import { UserData } from "@woi/service/co/idp/user/userList";
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";

export interface UserForm {
  username: string;
  password: string;
  passwordConfirm: string;
  role: OptionMap<string> | null;
  name: string;
  description: string;
  activeDate: DatePeriod;
  enabled: boolean;
  isLocked: boolean;
}

const initialUserForm: UserForm = {
  username: '',
  password: '',
  passwordConfirm: '',
  role: null,
  name: '',
  description: '',
  activeDate: {
    startDate: null,
    endDate: null,
  },
  enabled: false,
  isLocked: false,
};

interface UserUpsertProps {
  selectedData: UserData | null;
  onHide: () => void;
  fetchUserList: () => void;
}

function useUserUpsert(props: UserUpsertProps) {
  const { selectedData, onHide, fetchUserList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');

  const formData = useForm<UserForm>({
    defaultValues: initialUserForm,
  });
  const { handleSubmit, setValue, getValues, clearErrors } = formData;
  const [loading, setLoading] = useState<boolean>(false);
  const { merchantCode } = useCommunityOwner();

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation(isUpdate ? {
      title: tCommon('confirmationUpdateTitle', { text: 'User' }),
      message: tCommon('confirmationUpdateDescription', { text: 'User' }),
      primaryText: tCommon('confirmationUpdateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    } : {
      title: tCommon('confirmationCreateTitle', { text: 'User' }),
      message: tCommon('confirmationCreateDescription', { text: 'User' }),
      primaryText: tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationCreateNo'),
    });

    if (confirmed) {
      const { result, errorData, error } = isUpdate
        ? await useMerchantUserUpdateFetcher(baseUrl, selectedData!.id, {
          activeDate: stringToDateFormat(form.activeDate.startDate),
          inactiveDate: stringToDateFormat(form.activeDate.endDate),
          enabled: form.enabled,
          description: form.description,
          name: form.name,
          password: form.password,
          roleId: TextGetter.getterString(form.role?.value),
          username: form.username,
        })
        : await useMerchantCreateUser(baseUrl, {
          activeDate: stringToDateFormat(form.activeDate.startDate),
          inactiveDate: stringToDateFormat(form.activeDate.endDate),
          description: form.description,
          name: form.name,
          password: form.password,
          roleId: TextGetter.getterString(form.role?.value),
          username: form.username,
          merchantCode: merchantCode,

          type: 'REGULAR',
          coId: '',
          isComingFromKafkaMessage: false,
        });

      const failure = result?.failure || errorData?.failure;
      const message = errorData?.status?.text || errorData?.status?.message || errorData?.message || 'Something went wrong';

      if (!failure && !error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'User' })
          : tCommon('successAdd', { text: 'User' }
          ), { variant: 'info' });
        onHide();
        fetchUserList();
      } else {
        enqueueSnackbar(message, { variant: 'error' });
      }
    }
  });

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'User' }),
      message: tCommon('confirmationDeleteDescription', { text: 'User' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useUserDeleteFetcher(baseUrl, selectedData!.id);
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: 'User' }), { variant: 'info' });
        onHide();
        fetchUserList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: 'User' }), { variant: 'error' });
      }
    }
  };

  const handleActivateDeactivate = async () => {
    const enabled = getValues('enabled');

    const confirmed = await getConfirmation(enabled ? {
      title: tCommon('confirmationDeactivateTitle', { text: 'User' }),
      message: tCommon('confirmationDeactivateDescription', { text: 'User' }),
      primaryText: tCommon('confirmationDeactivateYes'),
      secondaryText: tCommon('confirmationDeactivateNo'),
    } : {
      title: tCommon('confirmationActivateTitle', { text: 'User' }),
      message: tCommon('confirmationActivateDescription', { text: 'User' }),
      primaryText: tCommon('confirmationActivateYes'),
      secondaryText: tCommon('confirmationActivateNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useUserActivationFetcher(baseUrl, selectedData!.id, {
        status: !enabled,
      });
      if (!error) {
        enqueueSnackbar(enabled
          ? tCommon('successDeactivate', { text: 'User' })
          : tCommon('successActivate', { text: 'User' }
          ), { variant: 'info' });
        onHide();
        fetchUserList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || enabled
          ? tCommon('failedDeactivate', { text: 'User' })
          : tCommon('failedActivate', { text: 'User' }
          ), { variant: 'error' });
      }
    }
  };

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'User' }),
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

  const handleLockUnlock = async () => {
    const isLocked = getValues('isLocked');

    const confirmed = await getConfirmation(isLocked ? {
      title: tCommon('confirmationUnlockTitle', { text: 'User' }),
      message: tCommon('confirmationUnlockDescription', { text: 'User' }),
      primaryText: tCommon('confirmationUnlockYes'),
      secondaryText: tCommon('confirmationUnlockNo'),
    } : {
      title: tCommon('confirmationLockTitle', { text: 'User' }),
      message: tCommon('confirmationLockDescription', { text: 'User' }),
      primaryText: tCommon('confirmationLockYes'),
      secondaryText: tCommon('confirmationLockNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useUserActivationLockFetcher(baseUrl, {
        principalSecureId: selectedData!.id,
        status: isLocked ? 'UNLOCK' : 'LOCK'
      });
      if (!error) {
        enqueueSnackbar(isLocked
          ? tCommon('successUnlock', { text: 'User' })
          : tCommon('successLock', { text: 'User' }
          ), { variant: 'info' });
        onHide();
        fetchUserList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || isLocked
          ? tCommon('failedUnlock', { text: 'User' })
          : tCommon('failedLock', { text: 'User' }
          ), { variant: 'info' });
      }
    }
  };

  const handleGeneratePassword = () => {
    const password = PasswordGenerator.getPasswordGenerator();
    setValue('password', password);
    setValue('passwordConfirm', password);
    clearErrors(['password', 'passwordConfirm']);
  };

  const fetchUserDetail = async (id: string) => {
    setLoading(true);
    const userDetailResponse = await useMerchantUserDetailFetcher(baseUrl, id);

    const { result, error } = userDetailResponse;

    let menuList: OptionMap<string>[] = [];

    if (result && !error) {
      setValue('name', result.name);
      setValue('description', result.description);
      const selectedRole = menuList.find(menu => menu.value === result.roleId);
      if (selectedRole) {
        setValue('role', selectedRole);
      }
      setValue('username', result.username);
      setValue('activeDate', { startDate: new Date(result.activeDate), endDate: new Date(result.inactiveDate) });
      setValue('enabled', result.enabled);
      setValue('isLocked', result.isLocked);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedData) {
      fetchUserDetail(selectedData.id);
    }
  }, [selectedData]);

  return {
    formData,
    loading,
    handleDelete,
    handleUpsert,
    handleGeneratePassword,
    handleActivateDeactivate,
    handleCancel,
    handleLockUnlock,
    setValue
  };
}

export default useUserUpsert;