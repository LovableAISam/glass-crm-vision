// Cores
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useRoleListFetcher, useUserDeleteFetcher, useUserListFetcher } from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useTranslation } from "react-i18next";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { UserData, UserListRequest } from "@woi/service/co/idp/user/userList";
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";

export type StatusType = 'ACTIVE' | 'INACTIVE';

type FilterForm = {
  username: string;
  status: OptionMap<StatusType>[];
  role: OptionMap<string>[];
  co: OptionMap<string>[];
  activeDate: DatePeriod;
};

function useUserList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [filterForm, setFilterForm] = useState<FilterForm>({
    username: '',
    status: [],
    role: [],
    co: [],
    activeDate: {
      startDate: null,
      endDate: null,
    }
  });
  const debouncedFilter = useDebounce(filterForm, 300);
  const statusOptions: OptionMap<StatusType>[] = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];
  const [sortBy, setSortBy] = useState<keyof UserData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');

  const { data: roleList } = useQuery(
    ['role-list'],
    async () => useRoleListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    }),
    { refetchOnWindowFocus: false }
  );

  const roleOptions: OptionMap<string>[] = useMemo(() => {
    if (!roleList) return [];
    return (roleList.result?.data || []).map(data => ({
      label: data.name,
      value: data.id
    }));
  }, [roleList]);

  const getSortPayload = (paramSortBy: keyof UserData) => {
    const sortMap: Record<keyof UserData, string> = {
      enabled: 'isEnable',
      role: 'role.name',
      id: 'id',
      createdDate: 'createdDate',
      modifiedDate: 'modifiedDate',
      co: 'co',
      type: 'type',
      username: 'username',
      isLocked: 'isLocked',
      description: 'description',
      password: 'password'
    };
    return sortMap[paramSortBy] || paramSortBy;
  };

  let newDirection;
  if (sortBy === 'enabled') {
    newDirection = direction === 'asc' ? 'desc' : 'asc';
  } else {
    newDirection = direction;
  }

  const userPayload: UserListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${getSortPayload(sortBy)}:${newDirection}` : '',
    username: debouncedFilter.username,
    type: ['REGULAR'],
    co: debouncedFilter.co.map(data => data.value),
    role: debouncedFilter.role.map(data => data.value),
    status: debouncedFilter.status.map(data => data.value === 'ACTIVE'),
    'active-date': stringToDateFormat(debouncedFilter.activeDate.startDate),
    'inactive-date': stringToDateFormat(debouncedFilter.activeDate.endDate),
  };

  const {
    data: userData,
    status: userStatus,
    refetch: refetchUser
  } = useQuery(
    ['user-list', userPayload],
    async () => useUserListFetcher(baseUrl, userPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.data && !response.error) {
          setPagination(oldPagination => ({
            ...oldPagination,
            totalPages: Math.ceil(result.totalElements / pagination.limit),
            totalElements: result.totalElements,
          }));
        }
      },
      onError: () => {
        setPagination(oldPagination => ({
          ...oldPagination,
          totalPages: 0,
          currentPage: 0,
          totalElements: 0,
        }));
      }
    }
  );

  const handleDelete = async (selectedData: UserData) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'User' }),
      message: tCommon('confirmationDeleteDescription', { text: 'User' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useUserDeleteFetcher(baseUrl, selectedData.id);
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: 'User' }), { variant: 'info' });
        refetchUser();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: 'User' }), { variant: 'error' });
      }
    }
  };

  const handleSort = (columnId: keyof UserData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    handleDelete,
    statusOptions,
    roleOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    userData: userData?.result?.data || [],
    userStatus,
    fetchUserList: () => {
      refetchUser();
    },
  };
}

export default useUserList;