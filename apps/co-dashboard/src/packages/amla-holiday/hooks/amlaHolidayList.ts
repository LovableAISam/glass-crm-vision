// Cores
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useAMLAHolidayFetcher, useHolidayDeleteFetcher, useYearListFetcher } from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { useTranslation } from "react-i18next";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { OptionMap } from "@woi/option";
import { AMLAHolidayData, AMLAHolidayRequest } from "@woi/service/co/admin/report/amlaHoliday";

export type StatusType = 'ACTIVE' | 'INACTIVE';

type FilterForm = {
  year: OptionMap<string>[];
};

function useAMLAHoliday() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [filterForm, setFilterForm] = useState<FilterForm>({
    year: [],
  });
  const debouncedFilter = useDebounce(filterForm, 300);
  const statusOptions: OptionMap<string>[] = [
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
  ];
  const [sortBy, setSortBy] = useState<keyof AMLAHolidayData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');
  const { t: tAMLAHoliday } = useTranslation('amlaHoliday');

  const { data: roleList } = useQuery(
    ['amla-holiday-year-list'],
    async () => useYearListFetcher(baseUrl),
    { refetchOnWindowFocus: false }
  );

  const yearOptions: OptionMap<string>[] = useMemo(() => {
    if (!roleList) return [];
    return (roleList.result || []).map(data => ({
      label: data,
      value: data
    }));
  }, [roleList]);

  const getSortPayload = (paramSortBy: keyof AMLAHolidayData) => {
    const sortMap: Record<keyof AMLAHolidayData, string> = {
      id: 'id',
      holidayDate: 'holidayDate',
      description: 'description',
    };
    return sortMap[paramSortBy] || paramSortBy;
  };

  const amlaHolidayListPayload: AMLAHolidayRequest = {
    page: pagination.currentPage,
    size: pagination.limit,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
    year: debouncedFilter.year.length ? debouncedFilter.year.map(data => data.value) : [JSON.stringify(new Date().getFullYear())],
  };

  const {
    data: amlaHolidayData,
    status: amlaHolidayStatus,
    refetch: fetchAMLAHolidayList
  } = useQuery(
    ['amla-holiday-list', amlaHolidayListPayload],
    async () => useAMLAHolidayFetcher(baseUrl, amlaHolidayListPayload),
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

  const handleDelete = async (selectedData: AMLAHolidayData) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: tAMLAHoliday('confirmTitle') }),
      message: tCommon('confirmationDeleteDescription', { text: tAMLAHoliday('confirmDescription') }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      const { error, errorData } = await useHolidayDeleteFetcher(baseUrl, selectedData.id);
      if (!error) {
        enqueueSnackbar(tCommon('successDelete', { text: tAMLAHoliday('confirmTitle') }), { variant: 'info' });
        fetchAMLAHolidayList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCommon('failedDelete', { text: tAMLAHoliday('confirmTitle') }), { variant: 'error' });
      }
    }
  };

  const handleSort = (columnId: keyof AMLAHolidayData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    handleDelete,
    statusOptions,
    yearOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    amlaHolidayData: amlaHolidayData?.result?.data || [],
    amlaHolidayStatus,
    fetchAMLAHolidayList: () => {
      fetchAMLAHolidayList();
    },
  };
}

export default useAMLAHoliday;