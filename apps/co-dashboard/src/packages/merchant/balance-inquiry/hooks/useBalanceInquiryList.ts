// Cores
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { reverseDirection } from "@woi/core";
import { useBalanceInquiryFetcher } from "@woi/service/co";
import { useCommunityOwner } from "@src/shared/context/CommunityOwnerContext";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { BalanceInquiryData, BalanceInquiryRequest } from "@woi/service/co/merchant/balanceInquiryList";


function useBalanceInquiryList() {
  const { baseUrl } = useBaseUrl();
  const { merchantCode } = useCommunityOwner();

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof BalanceInquiryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");

  const payload: BalanceInquiryRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    "merchant code": merchantCode
  };

  const {
    data: balanceInquiryData,
    status: balanceInquiryStatus,
  } = useQuery(
    ['balance-inquiry', payload],
    async () => useBalanceInquiryFetcher(baseUrl, payload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.balanceInquiryList && !response.error) {
          setPagination(oldPagination => ({
            ...oldPagination,
            totalPages: result.totalPages,
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

  const handleSort = (columnId: keyof BalanceInquiryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    balanceInquiryData: balanceInquiryData?.result?.balanceInquiryList || [],
    balanceInquiryStatus,
    balanceInquiryHeader: balanceInquiryData?.result?.balanceInquiryHeader,
  };
}

export default useBalanceInquiryList;
