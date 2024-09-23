// Cores
import { useState } from "react";

// Hooks & Utils
import { useEmailContentListFetcher } from "@woi/service/co";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useQuery } from "@tanstack/react-query";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { EmailContentData, EmailContentListRequest } from "@woi/service/principal/admin/emailContent/emailContentList";

function useEmailContentList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof EmailContentData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const { baseUrl } = useBaseUrl();

  const getSortPayload = (paramSortBy: keyof EmailContentData) => {
    if (paramSortBy === 'transactionType') return 'transactionType.name';
    return paramSortBy;
  };

  const emailContentPayload: EmailContentListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
  };

  const {
    data: emailContentData,
    status: emailContentStatus,
    refetch: refetchEmailContent
  } = useQuery(
    ['email-content-list', emailContentPayload],
    async () => useEmailContentListFetcher(baseUrl, emailContentPayload),
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

  const handleSort = (columnId: keyof EmailContentData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const fetchEmailContentList = () => {
    refetchEmailContent();
  };

  return {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    emailContentData: emailContentData?.result?.data || [],
    emailContentStatus,
    fetchEmailContentList,
    getSortPayload
  };
}

export default useEmailContentList;