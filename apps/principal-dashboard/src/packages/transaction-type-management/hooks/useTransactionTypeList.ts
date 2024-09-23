// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useTransactionTypeListFetcher } from "@woi/service/principal";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import {
  TransactionTypeData,
  TransactionTypeListRequest
} from "@woi/service/principal/admin/transactionType/transactionTypeList";

type FilterForm = {
  code: string;
  name: string;
};

function useTransactionTypeList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof TransactionTypeData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>({
    code: '',
    name: '',
  });
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();

  const transactionTypePayload: TransactionTypeListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    code: debouncedFilter.code,
    name: debouncedFilter.name,
  };

  const {
    data: transactionTypeData,
    status: transactionTypeStatus,
    refetch: refetchTransactionType
  } = useQuery(
    ['sms-content-list', transactionTypePayload],
    async () => await useTransactionTypeListFetcher(baseUrl, transactionTypePayload),
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

  const handleSort = (columnId: keyof TransactionTypeData) => {
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
    transactionTypeData: transactionTypeData?.result?.data || [],
    transactionTypeStatus,
    fetchTransactionTypeList: () => {
      refetchTransactionType();
    },
  };
}

export default useTransactionTypeList;