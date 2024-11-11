// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import {
  useAccountStatementBalanceFetcher,
  useTransactionHistoryExportFetcher,
  useTransactionHistoryListFetcher
} from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { TransactionHistoryData, TransactionHistoryListRequest } from "@woi/service/co/transaction/transactionHistory/transactionHistoryList";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";

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
};

function useActivityMemberHistoryList(props: ActivityMemberHistoryListProps) {
  const { phoneNumber } = props;
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
  const { t: tCO } = useTranslation('co');

  const { data: accountStatementData } = useQuery(
    ['account-statement-balance'],
    async () => useAccountStatementBalanceFetcher(baseUrl, {
      phoneNumber: props.phoneNumber,
    }),
    { refetchOnWindowFocus: false }
  );

  const getSortPayload = (paramSortBy: keyof TransactionHistoryData) => {
    // if (paramSortBy === 'transactionType') return 'transaction.transactionTypeName';
    // if (paramSortBy === 'transactionMethod') return 'transaction.transactionMethodName';
    // if (paramSortBy === 'referenceId') return 'transaction.referenceId';
    // if (paramSortBy === 'account') return 'transaction.accountStatementHistories.phoneNumber';
    return paramSortBy;
  };

  const activityMemberHistoryPayload: TransactionHistoryListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
    phoneNumber,
    startDate: stringToDateFormat(debouncedFilter.transactionDate.startDate),
    endDate: stringToDateFormat(debouncedFilter.transactionDate.endDate),
  };

  const {
    data: activityMemberHistoryData,
    status: activityMemberHistoryStatus,
  } = useQuery(
    ['kyc-request-list', activityMemberHistoryPayload],
    async () => useTransactionHistoryListFetcher(baseUrl, activityMemberHistoryPayload),
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
    const { result, error, errorData } = await useTransactionHistoryExportFetcher(baseUrl, {
      page: pagination.currentPage,
      limit: pagination.limit,
      sort: sortBy ? `${sortBy}:${direction}` : '',
      phoneNumber,
      startDate: stringToDateFormat(transactionDate.startDate),
      endDate: stringToDateFormat(transactionDate.endDate),
    });
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-activity-history-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.data.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || tCO('downloadActivityHistoryFailed'), { variant: 'error' });
    }
  };

  return {
    balance: accountStatementData?.result?.data.balance || 0,
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
    getSortPayload
  };
}

export default useActivityMemberHistoryList;
