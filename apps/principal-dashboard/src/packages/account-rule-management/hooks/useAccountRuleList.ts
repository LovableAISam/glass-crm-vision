// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useAccountRuleListFetcher } from "@woi/service/principal";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { AccountRuleData, AccountRuleListRequest } from "@woi/service/principal/admin/accountRule/accountRuleList";

type FilterForm = {
  code: string;
  name: string;
};

const initialFilterForm: FilterForm = {
  code: '',
  name: '',
};

function useAccountRuleList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof AccountRuleData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();

  const accountRuleListPayload: AccountRuleListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    code: debouncedFilter.code,
    name: debouncedFilter.name,
  };

  const {
    data: accountRuleData,
    status: accountRuleStatus,
    refetch: refetchAccountRule
  } = useQuery(
    ['account-rule-list', accountRuleListPayload],
    async () => await useAccountRuleListFetcher(baseUrl, accountRuleListPayload),
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

  const handleSort = (columnId: keyof AccountRuleData) => {
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
    accountRuleData: accountRuleData?.result?.data || [],
    accountRuleStatus,
    fetchAccountRuleList: () => {
      refetchAccountRule();
    },
  };
}

export default useAccountRuleList;
