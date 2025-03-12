// Cores
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useBaseUrlPrincipal from "@src/shared/hooks/useBaseUrlPrincipal";
import useDebounce from "@woi/common/hooks/useDebounce";
import { reverseDirection } from "@woi/core";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";
import { calculateDateRangeDays, stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useQRISSettlementExportFetcher, useMerchantCategoryCodeListFetcher, useQRISSettelementDetailExportFetcher, useQRISSettlementFetcher, useTransactionTypeListFetcher } from "@woi/service/co";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";
import { QRISSettlement, QRISSettlementRequest } from "@woi/service/co/admin/report/qrisSettlement";

type FilterForm = {
  activeDate: DatePeriod;
  merchant: string;
  status: OptionMap<string>[];
  mcc: OptionMap<string>[];
};

const initialFilterForm: FilterForm = {
  activeDate: {
    startDate: null,
    endDate: null,
  },
  merchant: '',
  status: [],
  mcc: []
};

export interface QRISSettlementFilter {
  effectiveDate: DatePeriod;
}

const initialFeeSummary: QRISSettlementFilter = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

function useQRISSettlementList() {
  const { baseUrl } = useBaseUrl();
  const { baseUrlPrincipal } = useBaseUrlPrincipal();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 50,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof QRISSettlement>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);
  const debouncedFilter = useDebounce(filterForm, 300);

  const formData = useForm<QRISSettlementFilter>({
    defaultValues: initialFeeSummary,
  });
  const { handleSubmit } = formData;

  const { data: merchantListData } = useQuery(
    ['merchant-list'],
    async () => useTransactionTypeListFetcher(baseUrl, {
      limit: 100,
      page: 0,
      sort: 'name:asc'
    }),
    { refetchOnWindowFocus: false }
  );

  const merchantListOptions = useMemo(() => {
    if (!merchantListData?.result) return [];
    return merchantListData.result?.data.map((key) => ({
      label: key.name,
      value: key.code
    }));
  }, [merchantListData]);

  const { data: merchantCategoryCodeListData } = useQuery(
    ['merchant-category-code-list'],
    async () => useMerchantCategoryCodeListFetcher(baseUrlPrincipal, {
      pageSize: 100,
      pageNumber: 0,
    }),
    { refetchOnWindowFocus: false }
  );

  const merchantCategoryCodeListOptions = useMemo(() => {
    if (!merchantCategoryCodeListData?.result) return [];
    return merchantCategoryCodeListData.result?.mccList.map((key) => ({
      label: key.description,
      value: key.mcc
    }));
  }, [merchantCategoryCodeListData]);

  const statusOptions: OptionMap<string>[] = [
    { label: 'Paid', value: 'paid' },
    { label: 'Not Paid', value: 'not paid' },
  ];

  const qrisSettlementPayload: QRISSettlementRequest = {
    startAt: stringToDateFormat(debouncedFilter.activeDate.startDate),
    endAt: stringToDateFormat(debouncedFilter.activeDate.endDate),
    size: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    merchantName: debouncedFilter.merchant,
    mcc: debouncedFilter.mcc.map(data => data.value),
    status: debouncedFilter.status.map(data => data.value),
  };

  const {
    data: qrisSettlementResult,
    status: qrisSettlementStatus,
    refetch: refetchQRISSettlement
  } = useQuery(
    ['qris-settlement', qrisSettlementPayload],
    async () => useQRISSettlementFetcher(baseUrl, qrisSettlementPayload),
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

  const handleSort = (columnId: keyof QRISSettlement) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExportDetail = async (id: string) => {
    setIsLoadingDownload(true);
    const { result, error, errorData } = await useQRISSettelementDetailExportFetcher(baseUrl, { id: id });
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-qris-settlement-detal-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download qris settlement detail failed!', { variant: 'error' });
    }
    setIsLoadingDownload(false);

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
      const { result, error, errorData } = await useQRISSettlementExportFetcher(baseUrl, {
        startAt: stringToDateFormat(debouncedFilter.activeDate.startDate),
        endAt: stringToDateFormat(debouncedFilter.activeDate.endDate),
        size: pagination.limit,
        page: pagination.currentPage,
        sort: sortBy ? `${sortBy}:${direction}` : '',
        merchantName: debouncedFilter.merchant,
        mcc: debouncedFilter.mcc.map(data => data.value),
        status: debouncedFilter.status.map(data => data.value),
      });
      if (result && !error) {
        let link = document.createElement("a");
        link.download = `export-qris-settlement-summary-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
        link.href = result.url;
        link.click();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || 'Download qris settlement summary failed!', { variant: 'error' });
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
    qrisSettlementData: qrisSettlementResult?.result?.data || [],
    qrisSettlementStatus,
    fetchQRISSettlement: () => {
      refetchQRISSettlement();
    },
    merchantListOptions,
    handleExport,
    formData,
    isLoadingDownload,
    merchantCategoryCodeListOptions,
    statusOptions,
    handleExportDetail
  };
}

export default useQRISSettlementList;
