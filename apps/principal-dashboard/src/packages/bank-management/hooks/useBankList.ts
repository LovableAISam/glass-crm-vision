// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useBankListFetcher } from "@woi/service/principal";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { BankData, BankListRequest } from "@woi/service/principal/admin/bank/bankList";

type FilterForm = {
  search: string;
};

function useBankList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof BankData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>({
    search: '',
  });
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();

  const bankListPayload: BankListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    search: debouncedFilter.search,
  };

  const {
    data: bankData,
    status: bankStatus,
    refetch: refetchBank
  } = useQuery(
    ['bank-list', bankListPayload],
    async () => await useBankListFetcher(baseUrl, bankListPayload),
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

  const handleSort = (columnId: keyof BankData) => {
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
    bankData: bankData?.result?.data || [],
    bankStatus,
    fetchBankList: () => {
      refetchBank();
    },
  };
}

export default useBankList;