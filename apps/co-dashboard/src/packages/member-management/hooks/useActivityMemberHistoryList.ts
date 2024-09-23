// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import {
  useMemberTransactionHistoryExportFetcher,
  useMemberTransactionHistoryListFetcher,
} from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useSnackbar } from "notistack";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";
import { TransactionHistoryData } from "@woi/service/co/transaction/transactionHistory/transactionHistoryList";
import { MemberTransactionHistoryListRequest } from "@woi/service/co/transaction/transactionHistory/memberTransactionHistoryList";

type FilterForm = {
  transactionDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  transactionDate: {
    startDate: null,
    endDate: null,
  },
};

type ActivityMemberHistoryListProps = {
  phoneNumber?: string;
  selectedOption?: string;
};

function useActivityMemberHistoryList(props: ActivityMemberHistoryListProps) {
  const { phoneNumber, selectedOption } = props;
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof TransactionHistoryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();

  const activityMemberHistoryPayload: MemberTransactionHistoryListRequest = {
    endAt: stringToDateFormat(debouncedFilter.transactionDate.endDate),
    page: pagination.currentPage,
    phoneNumber,
    size: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    startAt: stringToDateFormat(debouncedFilter.transactionDate.startDate),
  };

  const {
    data: activityMemberHistoryData,
    status: activityMemberHistoryStatus,
  } = useQuery(
    ['kyc-request-list', activityMemberHistoryPayload],
    async () => useMemberTransactionHistoryListFetcher(baseUrl, activityMemberHistoryPayload),
    {
      enabled: Boolean(phoneNumber),
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.transactions && !response.error) {
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

  const handleSort = (columnId: keyof TransactionHistoryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = async () => {
    const { transactionDate } = filterForm;
    const { result, error, errorData } = await useMemberTransactionHistoryExportFetcher(baseUrl, {
      phoneNumber,
      page: pagination.currentPage,
      sort: sortBy ? `${sortBy}:${direction}` : '',
      startAt: stringToDateFormat(transactionDate.startDate),
      endAt: stringToDateFormat(transactionDate.endDate),
      fileExtension: selectedOption
    });
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-activity-history-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download activity history failed!', { variant: 'error' });
    }
  };

  return {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    activityMemberHistoryData: activityMemberHistoryData?.result?.transactions || [],
    activityMemberHistoryStatus,
  };
}

export default useActivityMemberHistoryList;
