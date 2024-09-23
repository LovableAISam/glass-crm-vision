// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useMemberLockListFetcher } from "@woi/service/co";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { reverseDirection } from "@woi/core";
import { MemberLockData, MemberLockListRequest } from "@woi/service/co/admin/member/memberLockList";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { OptionMap } from "@woi/option";
import useDebounce from "@woi/common/hooks/useDebounce";
import { CorrectionType } from "@woi/service/co/admin/balanceCorrection/createBalanceCorrection";

type FilterForm = {
  filterPhoneNumber: string;
  filterName: string;
};

const initialFilterForm: FilterForm = {
  filterPhoneNumber: "",
  filterName: ""
};

export interface CorrectionDataForm {
  amount: string;
  balance: string;
  action: OptionMap<CorrectionType> | null;
  password: string;
  reason: string;
}

function useBalanceCorrectionList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof MemberLockData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [privilegeType, setPrivilegeType] = useState<string>("REQUESTER");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);

  const getSortPayload = (paramSortBy: keyof MemberLockData) => {
    if (paramSortBy === 'balance') return 'balances';
    return paramSortBy;
  };

  const memberLockPayload: MemberLockListRequest = {
    limit: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
    name: debouncedFilter.filterName,
    phoneNumber: debouncedFilter.filterPhoneNumber,
  };

  const {
    data: memberLockData,
    status: memberLockStatus,
    refetch: refetchMemberLock
  } = useQuery(
    ['member-lock-list', memberLockPayload],
    async () => useMemberLockListFetcher(baseUrl, memberLockPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.data && !response.error) {
          setPagination(oldPagination => ({
            ...oldPagination,
            totalPages: Math.ceil(result.totalPages),
            totalElements: result.totalElements,
          }));
          setPrivilegeType(result.privilegeType);
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

  const handleSort = (columnId: keyof MemberLockData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    memberLockData: memberLockData?.result?.data || [],
    memberLockStatus,
    privilegeType,
    fetchMemberList: () => {
      refetchMemberLock();
    },
  };
}

export default useBalanceCorrectionList;
