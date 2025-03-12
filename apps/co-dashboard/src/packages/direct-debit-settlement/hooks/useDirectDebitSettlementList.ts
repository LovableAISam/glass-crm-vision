// Cores
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Hooks & Utils
import {
  useDirectDebitSettlementFetcher,
  useDirectDebitSettlementExportFetcher,
} from '@woi/service/co';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from '@woi/common/hooks/useDebounce';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { DirectDebitSettlementRequest } from '@woi/service/co/admin/report/directDebitSettlement';
import { batch, reverseDirection } from '@woi/core';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

// Types & Consts
import { PaginationData } from '@woi/core/api';
import { OptionMap } from '@woi/option';
import { DatePeriod } from '@woi/core/utils/date/types';
import { LONG_DATE_TIME_FORMAT_BE } from '@woi/core/utils/date/constants';

type FilterForm = {
  endAt: DatePeriod;
  status: OptionMap<string>[];
  merchantName: string;
};

const initialFilterForm: FilterForm = {
  endAt: {
    startDate: null,
    endDate: null,
  },
  status: [],
  merchantName: '',
};

type TransactionSummaryProps = {
  formatOption: string;
};

export interface COTransactionSummaryFilter {
  effectiveDate: DatePeriod;
}

const initialCOTransactionSummary: COTransactionSummaryFilter = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

function useDirectDebitSettlementList(props: TransactionSummaryProps) {
  const { formatOption } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof DirectDebitSettlementRequest>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);
  const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);

  const formData = useForm<COTransactionSummaryFilter>({
    defaultValues: initialCOTransactionSummary,
  });

  const { handleSubmit } = formData;

  const statusOptions: OptionMap<string>[] = [
    { label: 'Paid', value: 'paid' },
    { label: 'Not Paid', value: 'not paid' },
  ];

  const directDebitSettlementPayload: DirectDebitSettlementRequest = {
    startAt: stringToDateFormat(debouncedFilter.endAt.startDate),
    endAt: stringToDateFormat(debouncedFilter.endAt.endDate),
    size: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    status: debouncedFilter.status.map(data => data.value), //change with status
    merchantName: debouncedFilter.merchantName
      ? debouncedFilter.merchantName
      : '',
  };

  const {
    data: qrisReportData,
    status: qrisReportStatus,
    refetch: refetchQRISReport,
  } = useQuery(
    ['direct-debit-list', directDebitSettlementPayload],
    async () =>
      useDirectDebitSettlementFetcher(baseUrl, directDebitSettlementPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: response => {
        const result = response.result;
        if (result && result.data && !response.error) {
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
      },
    },
  );

  const handleDeleteFilter = (key: string, value: any) => {
    batch(() => {
      setPagination(oldPagination => ({
        ...oldPagination,
        currentPage: 0,
      }));
      setFilterForm(oldForm => ({
        ...oldForm,
        [key]: value,
      }));
    });
  };

  const handleSort = (columnId: keyof DirectDebitSettlementRequest) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = handleSubmit(async form => {
    const { effectiveDate } = form;

    if (
      calculateDateRangeDays(effectiveDate.startDate, effectiveDate.endDate) >
      90
    ) {
      enqueueSnackbar(tCommon('labelMaxDownloadExceed'), { variant: 'error' });
    } else if (pagination.totalElements > 100) {
      enqueueSnackbar(tCommon('labelMaxCountDownloadExceed'), {
        variant: 'error',
      });
    } else {
      setIsLoadingDownload(true);
      const { result, error, errorData } =
        await useDirectDebitSettlementExportFetcher(baseUrl, {
          startDate: stringToDateFormat(effectiveDate.startDate),
          endDate: stringToDateFormat(effectiveDate.endDate),
          format: formatOption,
          sort: sortBy ? `${sortBy}:${direction}` : '',
          merchantName: debouncedFilter.merchantName
            ? debouncedFilter.merchantName
            : '',
          status: debouncedFilter.status.map(data => data.value),
        });
      if (result && !error) {
        let link = document.createElement('a');
        link.download = `export-fee-summary-${stringToDateFormat(
          new Date(),
          LONG_DATE_TIME_FORMAT_BE,
        )}.xls`;
        link.href = result.url;
        link.click();
      } else {
        enqueueSnackbar(
          errorData?.details?.[0] || 'Download transaction summary failed!',
          { variant: 'error' },
        );
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
    qrisReportData: qrisReportData?.result?.data || [],
    qrisReportStatus,
    handleDeleteFilter,
    handleExport,
    fetchTransactionList: () => {
      refetchQRISReport();
    },
    formData,
    isLoadingDownload,
    statusOptions
  };
}

export default useDirectDebitSettlementList;
