// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { calculateDateRangeDays, stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useBankAccountSummaryExportFetcher, useBankAccountSummaryFetcher } from "@woi/service/co";
import { reverseDirection } from "@woi/core";
import { useSnackbar } from "notistack";
import { BankAccountSummaryData, BankAccountSummaryRequest } from "@woi/service/co/admin/report/bankAccountSummaryList";
import { useForm } from "react-hook-form";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";

type FilterForm = {
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  activeDate: {
    startDate: null,
    endDate: null,
  }
};

type ActivityMemberHistoryProps = {
  formatOption: string;
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

function useBankAccountSummaryList(props: ActivityMemberHistoryProps) {
  const { formatOption } = props;
  const { enqueueSnackbar } = useSnackbar();

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
  const [sortBy, setSortBy] = useState<keyof BankAccountSummaryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(getValues('effectiveDate'), 300);

  const memberPayload: BankAccountSummaryRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    startAt: stringToDateFormat(debouncedFilter.startDate),
    endAt: stringToDateFormat(debouncedFilter.endDate),
    sort: sortBy ? `${sortBy}:${direction}` : '',
  };

  const {
    data: bankAccountSummaryData,
    status: bankAccountSummaryStatus,
    refetch: refetchBankAccountSummary
  } = useQuery(
    ['bank-account-summary', memberPayload],
    async () => useBankAccountSummaryFetcher(baseUrl, memberPayload),
    {
      enabled: !(calculateDateRangeDays(getValues('effectiveDate.startDate'), getValues('effectiveDate.endDate')) > 730),
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.transactions && !response.error) {
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

  const handleSort = (columnId: keyof BankAccountSummaryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = handleSubmit(async (form) => {
    const { effectiveDate } = form;
    const { result, error, errorData } = await useBankAccountSummaryExportFetcher(baseUrl, {
      endAt: stringToDateFormat(effectiveDate.endDate),
      startAt: stringToDateFormat(effectiveDate.startDate),
      extension: formatOption,
      sort: sortBy ? `${sortBy}:${direction}` : '',
      account: bankAccountSummaryData?.result?.name
    });

    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-fee-summary-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download fee summary failed!', { variant: 'error' });
    }
  });

  return {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    bankAccountSummaryData: bankAccountSummaryData?.result?.transactions || [],
    bankAccountSummaryStatus,
    fetchMemberList: () => {
      refetchBankAccountSummary();
    },
    handleExport,
    bankAccountSummaryInfo: bankAccountSummaryData?.result,
    formData
  };
}

export default useBankAccountSummaryList;
