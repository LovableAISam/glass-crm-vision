// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useSMSContentListFetcher } from "@woi/service/co";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { SMSContentData, SMSContentListRequest } from "@woi/service/principal/admin/smsContent/smsContentList";

function useSMSContentList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof SMSContentData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const { baseUrl } = useBaseUrl();

  const smsContentPayload: SMSContentListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
  };

  const {
    data: smsContentData,
    status: smsContentStatus,
    refetch: refetchSmsContent
  } = useQuery(
    ['sms-content-list', smsContentPayload],
    async () => await useSMSContentListFetcher(baseUrl, smsContentPayload),
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

  const handleSort = (columnId: keyof SMSContentData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    smsContentData: smsContentData?.result?.data || [],
    smsContentStatus,
    fetchSMSContentList: () => {
      refetchSmsContent();
    },
  };
}

export default useSMSContentList;