// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useSystemParameterListFetcher } from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { reverseDirection } from "@woi/core";

// Types & Consts
import { SystemParameterData, SystemParameterListRequest } from "@woi/service/co/admin/systemParameter/systemParameterList";
import { PaginationData } from "@woi/core/api";

type FilterForm = {
  code: string;
};

function useSystemParameterList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [filterForm, setFilterForm] = useState<FilterForm>({
    code: '',
  });
  const debouncedFilter = useDebounce(filterForm, 300);
  const [sortBy, setSortBy] = useState<keyof SystemParameterData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const { baseUrl } = useBaseUrl();

  const systemParameterPayload: SystemParameterListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    code: debouncedFilter.code,
  };

  const {
    data: systemParameterData,
    status: systemParameterStatus,
    refetch: refetchSystemParameter
  } = useQuery(
    ['system-parameter-list', systemParameterPayload],
    async () => useSystemParameterListFetcher(baseUrl, systemParameterPayload),
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

  const handleSort = (columnId: keyof SystemParameterData) => {
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
    systemParameterData: systemParameterData?.result?.data || [],
    systemParameterStatus,
    fetchSystemParameterList: () => {
      refetchSystemParameter();
    },
  };
}

export default useSystemParameterList;