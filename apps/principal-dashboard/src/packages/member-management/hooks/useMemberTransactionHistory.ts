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
import { calculateDateRangeDays, stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useSnackbar } from "notistack";
import { reverseDirection } from "@woi/core";
import { useForm } from "react-hook-form";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";
import { TransactionHistoryData } from "@woi/service/co/transaction/transactionHistory/transactionHistoryList";
import { MemberTransactionHistoryListRequest } from "@woi/service/co/transaction/transactionHistory/memberTransactionHistoryList";

type ActivityMemberHistoryListProps = {
  phoneNumber?: string;
  selectedOption?: string;
};

export interface MemberHistoryTransaction {
  effectiveDate: DatePeriod;
}

const initialMemberHistoryTransaction: MemberHistoryTransaction = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

function useMemberTransactionHistory(props: ActivityMemberHistoryListProps) {
  const { phoneNumber, selectedOption } = props;

  const formData = useForm<MemberHistoryTransaction>({
    defaultValues: initialMemberHistoryTransaction,
  });
  const { handleSubmit, getValues } = formData;

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof TransactionHistoryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const debouncedFilter = useDebounce(getValues('effectiveDate'), 300);
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();

  const getSortPayload = (paramSortBy: keyof TransactionHistoryData) => {
    const sortMap: Partial<Record<keyof TransactionHistoryData, string>> = {
      transactionType: 'type',
    };

    const mappedSortBy = sortMap[paramSortBy];
    return mappedSortBy || paramSortBy;
  };

  const memberTransactionHistoryPayload: MemberTransactionHistoryListRequest = {
    startAt: stringToDateFormat(debouncedFilter.startDate),
    endAt: stringToDateFormat(debouncedFilter.endDate),
    page: pagination.currentPage,
    phoneNumber,
    size: pagination.limit,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
  };

  const {
    data: memberTransactionHistoryData,
    status: memberTransactionHistoryStatus,
  } = useQuery(
    ['member-transaction-history', memberTransactionHistoryPayload],
    async () => useMemberTransactionHistoryListFetcher(baseUrl, memberTransactionHistoryPayload),
    {
      enabled: Boolean(phoneNumber) && !(calculateDateRangeDays(getValues('effectiveDate.startDate'), getValues('effectiveDate.endDate')) > 730),
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

  const handleExport = handleSubmit(async (form) => {
    const { effectiveDate } = form;

    if (effectiveDate.startDate && effectiveDate.endDate) {
      const { result, error, errorData } = await useMemberTransactionHistoryExportFetcher(baseUrl, {
        phoneNumber,
        page: pagination.currentPage,
        sort: sortBy ? `${sortBy}:${direction}` : '',
        startAt: stringToDateFormat(effectiveDate.startDate),
        endAt: stringToDateFormat(effectiveDate.endDate),
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
    } else {

    }

  });

  return {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    memberTransactionHistoryData: memberTransactionHistoryData?.result?.transactions || [],
    memberTransactionHistoryStatus,
    formData
  };
}

export default useMemberTransactionHistory;
