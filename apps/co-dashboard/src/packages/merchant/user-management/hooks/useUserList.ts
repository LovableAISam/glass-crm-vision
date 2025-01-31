// Cores
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { reverseDirection } from "@woi/core";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useMerchantUserListFetcher, useRoleListFetcher, useUserDeleteFetcher } from "@woi/service/co";
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// Types & Consts
import { useCommunityOwner } from "@src/shared/context/CommunityOwnerContext";
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";
import { MerchantUserData, MerchantUserListRequest } from "@woi/service/co/merchant/merchantUserList";

export type StatusType = 'ACTIVE' | 'INACTIVE';

type FilterForm = {
  username: string;
  status: OptionMap<StatusType>[];
  co: OptionMap<string>[];
  activeDate: DatePeriod;
  role: OptionMap<string>[];
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
    co: [],
    role: [],
    activeDate: {
      startDate: null,
      endDate: null,
    }
  });
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();
  const { merchantCode } = useCommunityOwner();
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { t: tCommon } = useTranslation('common');

  const statusOptions: OptionMap<StatusType>[] = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];
  const [sortBy, setSortBy] = useState<keyof MerchantUserData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [roleOptions, setRoleOptions] = useState<OptionMap<string>[]>([]);

  const getSortPayload = (paramSortBy: keyof MerchantUserData) => {
    const sortMap: Record<keyof MerchantUserData, string> = {
      enabled: 'isEnable',
      id: 'id',
      createdDate: 'createdDate',
      modifiedDate: 'modifiedDate',
      type: 'type',
      username: 'username',
      isLocked: 'isLocked',
      role: 'role',
    };
    return sortMap[paramSortBy] || paramSortBy;
  };

  let newDirection;
  if (sortBy === 'enabled') {
    newDirection = direction === 'asc' ? 'desc' : 'asc';
  } else {
    newDirection = direction;
  }

  const userPayload: MerchantUserListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${getSortPayload(sortBy)}:${newDirection}` : '',
    username: debouncedFilter.username,
    type: ['REGULAR'],
    role: debouncedFilter.role.map(data => data.value),
    status: debouncedFilter.status.map(data => data.value === 'ACTIVE'),
    createdDateFrom: stringToDateFormat(debouncedFilter.activeDate.startDate),
    createdDateTo: stringToDateFormat(debouncedFilter.activeDate.endDate),
    merchantCode
  };

  const {
    data: userData,
    status: userStatus,
    refetch: refetchUser
  } = useQuery(
    ['user-list', userPayload],
    async () => useMerchantUserListFetcher(baseUrl, userPayload),
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

  const { data: roleList } = useQuery(
    ['role-list'],
    async () => useRoleListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    }),
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (roleList && userData?.result?.data) {
      const options = (roleList.result?.data || []).map(data => ({
        label: data.name,
        value: data.id
      }));
      const role = userData?.result?.data[0]?.role
      setRoleOptions(options.filter((el) => el.label === role));
    }
  }, [userData, roleList]);

  const handleDelete = async (selectedData: MerchantUserData) => {
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

  const handleSort = (columnId: keyof MerchantUserData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    handleDelete,
    statusOptions,
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
    roleOptions
  };
}

export default useUserList;