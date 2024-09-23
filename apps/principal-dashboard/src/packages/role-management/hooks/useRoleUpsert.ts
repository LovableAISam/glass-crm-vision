import { useEffect, useMemo, useState } from "react";
import { useRoleCreateFetcher, useRoleDeleteFetcher, useRoleDetailFetcher, useRoleUpdateFetcher, useRoleUserListFetcher } from "@woi/service/principal";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { RoleData } from "@woi/service/principal/idp/role/roleList";
import useMenuListFetcher, { MenuData } from "@woi/service/principal/idp/menu/menuList";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type PrivilegeType = 'VIEW_ONLY' | 'ADD_EDIT' | 'ADD_EDIT_DELETE' | '';

export interface RoleDataPrivilege {
  menuId: string;
  menuName: string;
  checked: boolean;
  privilegeType: PrivilegeType;
}

export interface RoleForm {
  name: string;
  description: string;
  menuPrivileges: RoleDataPrivilege[];
  isActive: boolean;
}

const initialRoleForm: RoleForm = {
  name: '',
  description: '',
  menuPrivileges: [],
  isActive: false,
}

interface RoleUpsertProps {
  selectedData: RoleData | null;
  onHide: () => void;
  fetchRoleList: () => void;
}

function useRoleUpsert(props: RoleUpsertProps) {
  const { selectedData, onHide, fetchRoleList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();

  const [touched, setTouched] = useState<boolean>(false);
  const [menuList, setMenuList] = useState<MenuData[]>([]);
  const [userList, setUserList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchMenu, setSearchMenu] = useState<string>('');
  const [searchUser, setSearchUser] = useState<string>('');
  const formData = useForm<RoleForm>({
    defaultValues: initialRoleForm,
  });
  const { handleSubmit, setValue, watch, getValues } = formData;
  const { t: tCommon } = useTranslation('common');

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'Role' }),
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
      title: tCommon('confirmationDeactivateTitle', { text: 'Role' }),
      message: tCommon('confirmationDeactivateDescription', { text: 'Role' }),
      primaryText: tCommon('confirmationDeactivateYes'),
      secondaryText: tCommon('confirmationDeactivateNo'),
    } : {
      title: tCommon('confirmationActivateTitle', { text: 'Role' }),
      message: tCommon('confirmationActivateDescription', { text: 'Role' }),
      primaryText: tCommon('confirmationActivateYes'),
      secondaryText: tCommon('confirmationActivateNo'),
    });

    if (confirmed) {
      enqueueSnackbar(isActive
        ? tCommon('successDeactivate', { text: 'Member' })
        : tCommon('successActivate', { text: 'Member' }
        ), { variant: 'info' });
    }
  }

  const handleUpsert = handleSubmit(async (form) => {
    if (!form.menuPrivileges.some(menuPrivilege => menuPrivilege.checked && menuPrivilege.privilegeType)) {
      setTouched(true);
      return;
    }
    if (!form.menuPrivileges.filter(menuPrivilege => menuPrivilege.checked).every(menuPrivilege => menuPrivilege.privilegeType)) {
      setTouched(true);
      return;
    }

    const confirmed = await getConfirmation(isUpdate ? {
      title: tCommon('confirmationUpdateTitle', { text: 'Role' }),
      message: tCommon('confirmationUpdateDescription', { text: 'Role' }),
      primaryText: tCommon('confirmationUpdateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    } : {
      title: tCommon('confirmationCreateTitle', { text: 'Role' }),
      message: tCommon('confirmationCreateDescription', { text: 'Role' }),
      primaryText: tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationCreateNo'),
    });

    if (confirmed) {
      const payload = {
        name: form.name,
        description: form.description,
        menuPrivileges: form.menuPrivileges.filter(menuPrivilege => menuPrivilege.checked).map(menuPrivilege => ({
          menuId: menuPrivilege.menuId,
          privilegeType: menuPrivilege.privilegeType,
        })),
      }
      const { error, errorData } = isUpdate
        ? await useRoleUpdateFetcher(baseUrl, selectedData!.id, payload)
        : await useRoleCreateFetcher(baseUrl, payload)
      if (!error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'Role' })
          : tCommon('successAdd', { text: 'Role' }
          ), { variant: 'info' });
        onHide();
        fetchRoleList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || isUpdate
          ? tCommon('failedUpdate', { text: 'Role' })
          : tCommon('failedCreate', { text: 'Role' }
          ), { variant: 'info' });
      }
    }
  })

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'Role' }),
      message: tCommon('confirmationDeleteDescription', { text: 'Role' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useRoleDeleteFetcher(baseUrl, selectedData!.id)
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: 'Role' }), { variant: 'info' });
        onHide();
        fetchRoleList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: 'Role' }), { variant: 'error' });
      }
    }
  }

  const fetchMenuList = async () => {
    const { result, error } = await useMenuListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setMenuList(result.data)
      setValue('menuPrivileges', result.data.map(data => ({
        menuId: data.id,
        menuName: data.name,
        checked: false,
        privilegeType: '' as PrivilegeType,
      })))
    }
  }

  const fetchRoleUserList = async (id: string) => {
    const { result, error } = await useRoleUserListFetcher(baseUrl, id, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setUserList(result.data)
    }
  }

  const fetchRoleDetail = async (id: string) => {
    setLoading(true);
    const [menuListResponse, roleDetailResponse] = await Promise.all([
      useMenuListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
      }),
      useRoleDetailFetcher(baseUrl, id),
    ]);
    const { result: resultRoleDetail, error: errorRoleDetail } = roleDetailResponse;
    const { result: resultMenuList, error: errorMenuList } = menuListResponse;

    let menuListTemp: MenuData[] = [];
    if (resultMenuList && !errorMenuList) {
      menuListTemp = resultMenuList.data;
    }

    if (resultRoleDetail && !errorRoleDetail) {
      setValue('name', resultRoleDetail.name)
      setValue('description', resultRoleDetail.description)
      setValue('menuPrivileges', menuListTemp.map(data => {
        const selectedPrivilege = resultRoleDetail.menuPrivileges.find(menuPrivilege => menuPrivilege.menuId === data.id);
        return {
          menuId: data.id,
          menuName: data.name,
          checked: Boolean(selectedPrivilege),
          privilegeType: (selectedPrivilege ? selectedPrivilege.privilegeType : '') as PrivilegeType,
        }
      }))
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedData) {
      fetchRoleDetail(selectedData.id);
      fetchRoleUserList(selectedData.id);
    } else {
      fetchMenuList();
    }
  }, [selectedData])

  const filteredUserList = useMemo(() => {
    return userList.filter(user => user.toLowerCase().includes(searchUser.toLowerCase()))
  }, [userList, searchUser]);

  const menuPrivileges = watch('menuPrivileges')
  const filteredMenuPrivileges = useMemo(() => {
    return menuPrivileges.filter(menuPrivilege => menuPrivilege.menuName.toLowerCase().includes(searchMenu.toLowerCase()))
  }, [menuPrivileges, searchMenu])

  return {
    userList: filteredUserList,
    menuPrivileges: filteredMenuPrivileges,
    menuList,
    searchMenu,
    setSearchMenu,
    searchUser,
    setSearchUser,
    formData,
    touched,
    loading,
    handleDelete,
    handleUpsert,
    handleCancel,
    handleActivateDeactivate,
  }
}

export default useRoleUpsert;