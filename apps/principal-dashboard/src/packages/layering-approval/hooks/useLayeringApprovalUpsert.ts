import { useEffect, useState } from "react";
import { useApprovalLayerDeleteFetcher, useApprovalLayerCreateFetcher, useApprovalLayerDetailFetcher, useMenuListFetcher, useRoleListFetcher } from "@woi/service/principal";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { OptionMap } from "@woi/option";
import { useForm } from 'react-hook-form';
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { ApprovalLayerCreateRequest } from "@woi/service/principal/admin/approvalLayer/approvalLayerCreate";
import { TextGetter } from "@woi/core";
import { useTranslation } from "react-i18next";

export interface ApprovalLayerForm {
  menu: OptionMap<string> | null;
  roles: {
    role: OptionMap<string> | null;
  }[];
}

const initialApprovalLayerForm: ApprovalLayerForm = {
  menu: null,
  roles: [],
}

interface LayeringApprovalUpsertProps {
  selectedData: any | null;
  onHide: () => void;
  fetchApprovalLayerList: () => void;
}

function useLayeringApprovalUpsert(props: LayeringApprovalUpsertProps) {
  const { selectedData, onHide, fetchApprovalLayerList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const [touched, setTouched] = useState<boolean>(false);
  const [menuOptions, setMenuOptions] = useState<OptionMap<string>[]>([]);
  const [roleOptions, setRoleOptions] = useState<OptionMap<string>[]>([]);
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');

  const formData = useForm<ApprovalLayerForm>({
    defaultValues: initialApprovalLayerForm,
  });
  const { handleSubmit, setValue } = formData;
  const [loading, setLoading] = useState<boolean>(false);

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'Approval Layer' }),
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

  const fetchMenuList = async () => {
    const { result, error } = await useMenuListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    })

    if (result && !error) {
      setMenuOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })))
    }
  }

  const fetchRoleList = async () => {
    const { result, error } = await useRoleListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    })

    if (result && !error) {
      setRoleOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })))
    }
  }

  const handleUpsert = handleSubmit(async (form) => {
    if (form.roles.length === 0) {
      setTouched(true);
      return;
    }
    const confirmed = await getConfirmation({
      title: isUpdate
        ? tCommon('confirmationUpdateTitle', { text: 'Approval Layer' })
        : tCommon('confirmationCreateTitle', { text: 'Approval Layer' }),
      message: isUpdate
        ? tCommon('confirmationUpdateDescription', { text: 'Approval Layer' })
        : tCommon('confirmationCreateDescription', { text: 'Approval Layer' }),
      primaryText: isUpdate
        ? tCommon('confirmationUpdateYes')
        : tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    });

    if (confirmed) {
      const payload: ApprovalLayerCreateRequest = {
        menu: TextGetter.getterString(form.menu?.label),
        menuId: TextGetter.getterString(form.menu?.value),
        role: form.roles.map(data => ({
          role: TextGetter.getterString(data.role?.label),
          roleId: TextGetter.getterString(data.role?.value),
        })),
      }
      const { error, errorData } = await useApprovalLayerCreateFetcher(baseUrl, payload)
      if (!error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'Approval Layer' })
          : tCommon('successAdd', { text: 'Approval Layer' }
          ), { variant: 'success' });
        onHide();
        fetchApprovalLayerList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || isUpdate
          ? tCommon('failedUpdate', { text: 'Approval Layer' })
          : tCommon('failedCreate', { text: 'Approval Layer' }
          ), { variant: 'error' });
      }
    }
  })

  const fetchApprovalLayerDetail = async (id: string) => {
    setLoading(true);
    const { result, error } = await useApprovalLayerDetailFetcher(baseUrl, id);

    if (result && !error) {
      setValue('menu', { label: result.menu, value: result.menuId });
      setValue('roles', result.role.map(data => ({
        role: {
          label: data.role,
          value: data.roleId
        }
      })));
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'Approval Layer' }),
      message: tCommon('confirmationDeleteDescription', { text: 'Approval Layer' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      const { error } = await useApprovalLayerDeleteFetcher(baseUrl, selectedData.id)
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: 'Approval Layer' }), { variant: 'info' });
        onHide();
        fetchApprovalLayerList();
      } else {
        enqueueSnackbar(tCommon('failedDelete', { text: 'Approval Layer' }), { variant: 'error' });
      }
    }
  }

  useEffect(() => {
    if (selectedData) {
      fetchApprovalLayerDetail(selectedData.id);
    }
  }, [selectedData])

  useEffect(() => {
    fetchMenuList();
    fetchRoleList();
  }, [])

  return {
    menuOptions,
    roleOptions,
    formData,
    touched,
    loading,
    handleUpsert,
    handleDelete,
    handleCancel,
  }
}

export default useLayeringApprovalUpsert;