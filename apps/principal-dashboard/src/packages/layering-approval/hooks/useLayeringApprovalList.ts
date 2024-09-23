// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useApprovalLayerListFetcher } from "@woi/service/principal";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import {
  ApprovalLayerData,
  ApprovalLayerListRequest
} from "@woi/service/principal/admin/approvalLayer/approvalLayerList";

type FilterForm = {
  menu: string;
};

const initialFilterForm: FilterForm = {
  menu: '',
};

function useLayeringApprovalList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof ApprovalLayerData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();

  const approvalLayerPayload: ApprovalLayerListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    menu: debouncedFilter.menu,
  };

  const {
    data: approvalLayerData,
    status: approvalLayerStatus,
    refetch: refetchApprovalLayer
  } = useQuery(
    ['approval-layer-list', approvalLayerPayload],
    async () => await useApprovalLayerListFetcher(baseUrl, approvalLayerPayload),
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

  const handleSort = (columnId: keyof ApprovalLayerData) => {
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
    approvalLayerData: approvalLayerData?.result?.data || [],
    approvalLayerStatus,
    fetchApprovalLayerList: () => {
      refetchApprovalLayer();
    },
  };
}

export default useLayeringApprovalList;