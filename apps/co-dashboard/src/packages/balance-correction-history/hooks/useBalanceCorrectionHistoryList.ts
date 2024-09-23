// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationData } from "@woi/core/api";

// Hooks & Utils
import { useBalanceCorrectionHistorytFetcher } from "@woi/service/co";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { OptionMap } from "@woi/option";
import { BalanceCorrectionHistoryData, BalanceCorrectionHistorytRequest, StatusType } from "@woi/service/co/admin/balanceCorrection/balanceCorrectionHistory";

type FilterForm = {
  status: OptionMap<StatusType>[];
  phoneNumber: string;
  memberName: string;
};

const initialFilterForm: FilterForm = {
  status: [],
  phoneNumber: "",
  memberName: ""
};
export interface UserForm {
  amount: string;
  balance: string;
  action: OptionMap<string> | null;
  password: string;
}

function useBalanceCorrectionHistoryList() {
  const { t: tBalanceCorrection } = useTranslation('balanceCorrection');
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof BalanceCorrectionHistoryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);

  const balanceCorrectionHistoryPayload: BalanceCorrectionHistorytRequest = {
    pageSize: pagination.limit,
    pageNumber: pagination.currentPage,
    sortBy: sortBy ? `${sortBy}:${direction}` : '',
    status: debouncedFilter.status.map(data => data.value),
    memberName: debouncedFilter.memberName,
    phoneNumber: debouncedFilter.phoneNumber
  };

  const statusOptions = <OptionMap<StatusType>[]>([
    {
      label: tBalanceCorrection('optionWaitingForApproval'),
      value: 'WAITING_APPROVAL',
    },
    {
      label: tBalanceCorrection('optionReject'),
      value: 'REJECTED',
    },
    {
      label: tBalanceCorrection('optionApproved'),
      value: 'APPROVED',
    },
  ]);

  const {
    data: balanceCorrectionHistoryData,
    status: balanceCorrectionHistoryStatus,
  } = useQuery(
    ['balance-correctioh-history', balanceCorrectionHistoryPayload],
    async () => useBalanceCorrectionHistorytFetcher(baseUrl, balanceCorrectionHistoryPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.balanceCorrectionDto && !response.error) {
          setPagination(oldPagination => ({
            ...oldPagination,
            totalPages: Math.ceil(result.totalPages),
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

  const handleSort = (columnId: keyof BalanceCorrectionHistoryData) => {
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
    balanceCorrectionHistoryData: balanceCorrectionHistoryData?.result?.balanceCorrectionDto || [],
    balanceCorrectionHistoryStatus,
    statusOptions,
  };
}

export default useBalanceCorrectionHistoryList;
