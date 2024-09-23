// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { calculateDateRangeDays, stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useDailyReportExportFetcher, useDailyReportFetcher } from "@woi/service/co";
import { useSnackbar } from "notistack";
import { batch, reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { DailyReportData, DailyReportRequest } from "@woi/service/co/admin/report/dailyReportList";

type FilterForm = {
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  activeDate: {
    startDate: null,
    endDate: null,
  }
};

function useDailyReportList() {
  const { enqueueSnackbar } = useSnackbar();
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof DailyReportData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);

  const handleChangeDate = (value: any): void => {
    batch(() => {
      const { startDate, endDate } = value;
      if (calculateDateRangeDays(startDate, endDate) > 730) {
        enqueueSnackbar(
          'Effective date to cannot be greater than 730 days from effective date from.',
          {
            variant: 'error',
          },
        );
      } else {
        setFilterForm((oldForm) => ({
          ...oldForm,
          activeDate: value,
        }));
      }
    });
  };

  const getSortPayload = (paramSortBy: keyof DailyReportData) => {
    if (paramSortBy === 'effectiveDate') return 'effective_date';
    return paramSortBy;
  };

  const memberPayload: DailyReportRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    startAt: stringToDateFormat(debouncedFilter.activeDate.startDate),
    endAt: stringToDateFormat(debouncedFilter.activeDate.endDate),
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
  };

  const {
    data: dailyReportData,
    status: dailyReoprtStatus,
    refetch: refetchDailyReport
  } = useQuery(
    ['daily-report', memberPayload],
    async () => useDailyReportFetcher(baseUrl, memberPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.dailyEonboardingLists && !response.error) {
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

  const handleExport = async (selectedData: DailyReportData) => {
    const { result, error, errorData } = await useDailyReportExportFetcher(baseUrl, {
      id: selectedData?.id,
    });

    if (result && !error) {
      let link = document.createElement("a");
      link.download = `${selectedData?.fileName}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download fee summary failed!', { variant: 'error' });
    }
  };

  const handleSort = (columnId: keyof DailyReportData) => {
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
    dailyReportData: dailyReportData?.result?.dailyEonboardingLists || [],
    dailyReoprtStatus,
    refetchDailyReport,
    handleExport,
    handleChangeDate,
    getSortPayload
  };
}

export default useDailyReportList;
