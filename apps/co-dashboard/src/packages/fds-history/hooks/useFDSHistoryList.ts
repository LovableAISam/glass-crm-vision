// Cores
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { reverseDirection } from "@woi/core";
import { calculateDateRangeDays, stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useFDSHistoryExportFetcher, useFDSHistoryListFetcher, useTransactionTypeListFetcher } from "@woi/service/co";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";
import { FDSHistory, FDSHistoryRequest } from "@woi/service/co/admin/fDSHistory/fDSHistoryList";
import useBaseMobileUrl from "@src/shared/hooks/useBaseUrlMobile";

type FilterForm = {
  phoneNumber: string;
  activeDate: DatePeriod;
  transactionType: OptionMap<string>[];
};

const initialFilterForm: FilterForm = {
  phoneNumber: '',
  activeDate: {
    startDate: null,
    endDate: null,
  },
  transactionType: [],
};

type FDSHistoryListProp = {
  formatOption: string;
};

export interface FDSHistoryFilter {
  effectiveDate: DatePeriod;
}

const initialFDSHistory: FDSHistoryFilter = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

function useFDSHistoryList(props: FDSHistoryListProp) {
  const { formatOption } = props;

  const { baseUrl } = useBaseUrl();
  const { baseMobileUrl } = useBaseMobileUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof FDSHistory>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);

  const debouncedFilter = useDebounce(filterForm, 300);

  const formData = useForm<FDSHistoryFilter>({
    defaultValues: initialFDSHistory,
  });
  const { handleSubmit } = formData;

  const { data: transactionTypeData } = useQuery(
    ['transaction-type-list-fds'],
    async () => useTransactionTypeListFetcher(baseUrl, {
      limit: 100,
      page: 0,
      sort: 'name:asc'
    }),
    { refetchOnWindowFocus: false }
  );

  const transactionTypeOptions = useMemo(() => {
    if (!transactionTypeData?.result) return [];
    return transactionTypeData.result?.data.map((key) => ({
      label: key.name,
      value: key.code
    }));
  }, [transactionTypeData]);

  const fDSHistoryPayload: FDSHistoryRequest = {
    page: pagination.currentPage,
    size: pagination.limit,
    phoneNumber: debouncedFilter.phoneNumber,
    startAt: stringToDateFormat(debouncedFilter.activeDate.startDate),
    endAt: stringToDateFormat(debouncedFilter.activeDate.endDate),
    transactionType: debouncedFilter.transactionType.map(data => data.label),
    sort: sortBy ? `${sortBy}:${direction}` : '',
  };

  const {
    data: fDSData,
    status: fDSStatus,
  } = useQuery(
    ['fds-history-list', fDSHistoryPayload],
    async () => useFDSHistoryListFetcher(baseMobileUrl, fDSHistoryPayload),
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

  const handleSort = (columnId: keyof FDSHistory) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = handleSubmit(async (form) => {
    const { effectiveDate } = form;

    if (calculateDateRangeDays(effectiveDate.startDate, effectiveDate.endDate) >
      90) {
      enqueueSnackbar(tCommon('labelMaxDownloadExceed'), { variant: 'error' });
    } else if (pagination.totalElements > 100) {
      enqueueSnackbar(tCommon('labelMaxCountDownloadExceed'), { variant: 'error' });
    } else {
      setIsLoadingDownload(true);
      const { result, error, errorData } = await useFDSHistoryExportFetcher(baseMobileUrl, {
        account: debouncedFilter.phoneNumber,
        startDate: stringToDateFormat(effectiveDate.startDate),
        endDate: stringToDateFormat(effectiveDate.endDate),
        sort: sortBy ? `${sortBy}:${direction}` : '',
        transactionType: debouncedFilter.transactionType.map(data => data.value),
        format: formatOption,
      });
      if (result && !error) {
        let link = document.createElement("a");
        link.download = `export-fee-summary-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
        link.href = result.url;
        link.click();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || 'Download fee summary failed!', { variant: 'error' });
      }
      setIsLoadingDownload(false);
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
    fDSData: fDSData?.result?.data || [],
    fDSStatus,
    transactionTypeOptions,
    handleExport,
    formData,
    isLoadingDownload
  };
}

export default useFDSHistoryList;
