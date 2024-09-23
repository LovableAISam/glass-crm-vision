import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { OptionMap } from "@woi/option";
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";

// Hooks & Utils
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { UserData } from "@woi/service/co/idp/user/userList";
import {
  useUserDeleteFetcher,
  useUserCreateFetcher,
  useUserUpdateFetcher,
  useUserDetailFetcher,
  useUserActivationFetcher,
  useUserActivationLockFetcher,
} from "@woi/service/co";
import useRoleListFetcher from "@woi/service/principal/idp/role/roleList";
import { DatePeriod } from "@woi/core/utils/date/types";
import { PasswordGenerator, TextGetter } from "@woi/core";

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
  const [roleOptions, setRoleOptions] = useState<OptionMap<string>[]>([]);

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
      const { error, errorData } = isUpdate
        ? await useUserUpdateFetcher(baseUrl, selectedData!.id, {
          activeDate: stringToDateFormat(form.activeDate.startDate),
          inactiveDate: stringToDateFormat(form.activeDate.endDate),
          enabled: form.enabled,
          description: form.description,
          name: form.name,
          password: form.password,
          roleId: TextGetter.getterString(form.role?.value),
          type: 'REGULAR',
          username: form.username,
        })
        : await useUserCreateFetcher(baseUrl, {
          activeDate: stringToDateFormat(form.activeDate.startDate),
          inactiveDate: stringToDateFormat(form.activeDate.endDate),
          description: form.description,
          name: form.name,
          password: form.password,
          roleId: TextGetter.getterString(form.role?.value),
          type: 'REGULAR',
          username: form.username,
        });

      if (!error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'User' })
          : tCommon('successAdd', { text: 'User' }
          ), { variant: 'info' });
        onHide();
        fetchUserList();
      } else {
        let errorMessage = errorData?.details?.[0];
        if (!errorMessage) {
          errorMessage = isUpdate
            ? tCommon('failedUpdate', { text: 'User' })
            : tCommon('failedCreate', { text: 'User' });
        } else {
          errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
        }
        enqueueSnackbar(errorMessage, { variant: 'info' });
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
        status: isLocked ? 'ACTIVE' : 'LOCK'
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

  const fetchRoleList = async () => {
    const { result, error } = await useRoleListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setRoleOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })));
    }
  };

  const fetchUserDetail = async (id: string) => {
    setLoading(true);
    const [roleListResponse, userDetailResponse] = await Promise.all([
      useRoleListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
      }),
      useUserDetailFetcher(baseUrl, id),
    ]);

    const { result: resultUserDetail, error: errorUserDetail } = userDetailResponse;
    const { result: resultRoleList, error: errorRoleList } = roleListResponse;

    let menuList: OptionMap<string>[] = [];
    if (resultRoleList && !errorRoleList) {
      menuList = resultRoleList.data.map(data => ({
        label: data.name,
        value: data.id,
      }));

      setRoleOptions(menuList);
    }

    if (resultUserDetail && !errorUserDetail) {
      setValue('name', resultUserDetail.name);
      setValue('description', resultUserDetail.description);
      const selectedRole = menuList.find(menu => menu.value === resultUserDetail.roleId);
      if (selectedRole) {
        setValue('role', selectedRole);
      }
      setValue('username', resultUserDetail.username);
      setValue('activeDate', { startDate: new Date(resultUserDetail.activeDate), endDate: new Date(resultUserDetail.inactiveDate) });
      setValue('enabled', resultUserDetail.enabled);
      setValue('isLocked', resultUserDetail.isLocked);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedData) {
      fetchUserDetail(selectedData.id);
    } else {
      fetchRoleList();
    }
  }, [selectedData]);

  return {
    formData,
    roleOptions,
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